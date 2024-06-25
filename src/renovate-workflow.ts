// eslint-disable-next-line @typescript-eslint/no-require-imports -- impossible for this to work with npx projen build otherwise
import assert = require('node:assert');
import { typescript, YamlFile, RenovatebotOptions } from 'projen';
import merge from 'ts-deepmerge';

export module renovateWorkflow {
  export const RENOVATE_GITHUB_USERNAME = 'cu-infra-svc-git';

  export const AUTO_APPROVE_PR_LABEL = 'auto-approve';
  export const DEFAULT_RENOVATE_PR_LABEL = 'renovate';
  export const OPTIONAL_RENOVATE_PR_LABEL = 'optional';

  function getDefaultWorkflow(cronSchedule: string) {
    return {
      name: 'upgrade-main',
      on: {
        schedule: [
          {
            cron: cronSchedule,
          },
        ],
        workflow_dispatch: {},
        // Run immediately on any changes to the renovate config or workflow
        push: {
          branches: ['main'],
          paths: ['renovate.json5', '.github/workflows/renovate.yml'],
        },
        // Run immediately when a box to update a dependency is checked on the renovate dashboard issue
        issues: {
          types: ['edited'],
        },
        // or when the rebase now checkbox is ticked on a renovate PR description
        pull_request: {
          types: ['edited'],
        },
      },
      // Prevent renovate running multiple times in parallel due to several subsequent trigger events occurring
      concurrency: {
        group: "${{ github.workflow }}-${{ github.event_name == 'workflow_dispatch' && github.event_name || '' }}",
      },
      jobs: {
        'upgrade-main': {
          'runs-on': 'ubuntu-latest',
          permissions: {
            contents: 'read',
          },
          steps: [
            {
              name: 'Checkout',
              uses: 'actions/checkout@v4',
            },
            {
              name: 'Self-hosted Renovate',
              uses: 'renovatebot/github-action@v40.1.6', // We might want to un-pin this or figure out a renovate process for it.
              // Skip running renovate in a loop when renovate updates the dependency dashboard issue and re-triggers this workflow
              if: `(github.event_name != 'issues' && github.event_name != 'pull_request') || github.actor != '${RENOVATE_GITHUB_USERNAME}'`,
              with: {
                // projen creates this config for us
                configurationFile: 'renovate.json5',
                // Run projen as the cu-infra-svc-git user
                // We cannot use the default GITHUB_TOKEN to auth as explained here:
                // https://github.com/renovatebot/github-action#token
                token: 'x-access-token:${{ secrets.RENOVATEBOT_GITHUB_TOKEN }}',
              },
              env: {
                // Private github packages auth
                RENOVATE_HOST_RULES:
                  '[{"matchHost":"https://npm.pkg.github.com/","hostType":"npm","token":"${{ secrets.ALL_PACKAGE_READ_TOKEN }}"}]',
                RENOVATE_NPMRC: '@${{ github.repository_owner }}:registry=https://npm.pkg.github.com',
                // Only update npm dependencies for now
                RENOVATE_ENABLED_MANAGERS: '["npm"]',
                // Tell renovate to run on this repo, without this renovate won't run
                RENOVATE_REPOSITORIES: '["${{ github.repository }}"]',
                // Bypass schedule when the workflow is manually triggered,
                // otherwise the user has to then go and check the box on the dependency dashboard to
                // receive updates and this is kind of confusing
                RENOVATE_FORCE: "${{ github.event_name == 'workflow_dispatch' && '{\"schedule\":null}' || '' }}",
              },
            },
          ],
        },
      },
    };
  }

  export interface RenovateOptionsConfig {
    /**
     * Whether to auto merge non breaking dependency updates.
     *
     * Note: if you have the "Require review from Code Owners" option enabled in the branch protection rules this will not work
     */
    readonly autoMergeNonBreakingUpdates?: boolean;

    /**
     * Allows overriding any renovate config option default. This is deep merged into the default config
     */
    readonly defaultOverrides?: RenovatebotOptions;
  }

  export function getRenovateOptions(options: RenovateOptionsConfig = {}) {
    return merge(
      {
        scheduleInterval: ['before 2am on Monday'],
        ignoreProjen: true,
        ignore: [
          'node', // managed by projen
          '@time-loop/clickup-projen', // managed as part of the projen upgrade workflow
        ],
        overrideConfig: {
          /* override projen renovate defaults */
          // Remove :preserveSemverRanges preset added by projen to make renovate update all non breaking dependencies
          extends: [
            'config:base',
            'group:recommended',
            'group:monorepos',
            // Add merge confidence columns to update PRs
            'github>whitesource/merge-confidence:beta',
          ],
          packageRules: [
            {
              // copied from this preset: https://docs.renovatebot.com/presets-group/#groupallnonmajor
              groupName: 'all non-major dependencies',
              groupSlug: 'all-minor-patch',
              matchPackagePatterns: ['*'],
              excludePackagePatterns: ['^@time-loop\\/clickup-projen'],
              matchUpdateTypes: ['minor', 'patch'],
              // Tell renovate to enable github's auto merge feature on the PR
              automerge: options.autoMergeNonBreakingUpdates ? true : undefined,
              // Adding the auto-approve label will make projens auto approve workflow approve the PR so it will be auto merged
              addLabels: [options.autoMergeNonBreakingUpdates ? AUTO_APPROVE_PR_LABEL : undefined],
            },
            {
              matchDepTypes: ['optionalDependencies'],
              addLabels: [OPTIONAL_RENOVATE_PR_LABEL],
            },
            {
              matchPackagePatterns: ['^@time-loop\\/clickup-projen'],
              // Bypass prerelease versions:
              // https://docs.renovatebot.com/configuration-options/#allowedversions
              // Ex: 1.1.1 is allowed, 1.1.1-beta.0 is not allowed.
              allowedVersions: '!/^[0-9]+\\.[0-9]+\\.[0-9]+(\\.[0-9]+)?-(alpha|beta).*$/',
            },
            {
              matchPackagePrefixes: ['@time-loop/'],
              matchUpdateTypes: ['major'],
              prBodyNotes: ['# MAJOR VERSION UPDATE', 'Read the release notes!'],
            },
          ],

          /* override defaults set in config:base preset */
          // update all dependencies, not just major versions
          rangeStrategy: 'bump',
          // Create PRs for all updates in one go as we only run renovate once a week
          // as this option is designed for when renovate runs hourly
          prHourlyLimit: 0,
          // Have no limit on the number of renovate PRs open
          prConcurrentLimit: 0,
          // Always create PRs for auto merging to make required status checks run and provide an audit trail
          automergeType: 'pr',
          // Use github's auto merge feature and not renovate's built in alternative
          platformAutomerge: true,
        },
      },
      options.defaultOverrides ?? {
        labels: [DEFAULT_RENOVATE_PR_LABEL],
      },
    );
  }

  export function addRenovateWorkflowYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/workflows/renovate.yml', {
      obj: { ...getDefaultWorkflow(getWorkflowCronSchedule(project.name)), ...override },
    });
  }
}

/**
 * As we have a lot of CDK repos, we want to spread out the renovate schedules over the first hour of the day
 * so they don't all run at the same time and end up failing due to github rate limiting the account used by renovate.
 * @param projectName - the CDK project name. Used so the calculated offset is deterministic for a given project.
 */
function getWorkflowCronSchedule(projectName: string): string {
  const projectNameHash = getProjectNameHash(projectName);
  const MINUTES_IN_HOUR = 60;
  const minute = projectNameHash % MINUTES_IN_HOUR;
  const MINUTE_GROUP_INTERVAL = 5;
  // Round to nearest 5 minutes to guarantee that previous renovate runs on other repos have finished
  const groupedMinute = Math.floor(minute / MINUTE_GROUP_INTERVAL) * MINUTE_GROUP_INTERVAL;
  assert(
    groupedMinute < MINUTES_IN_HOUR,
    `Renovate schedule minute should be less than ${MINUTES_IN_HOUR} but was ${groupedMinute} for project ${projectName}`,
  );
  // Run daily to update the renovate dependency dashboard issue with new updates
  return `${groupedMinute} 0 * * MON-FRI`;
}

/**
 * Get a deterministic hash for a given project name
 * @param projectName
 */
function getProjectNameHash(projectName: string): number {
  return projectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
