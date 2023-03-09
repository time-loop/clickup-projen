import { typescript, YamlFile, RenovatebotOptions } from 'projen';
import merge from 'ts-deepmerge';

export module renovateWorkflow {
  export const RENOVATE_GITHUB_USERNAME = 'cu-infra-svc-git';

  export const AUTO_APPROVE_PR_LABEL = 'auto-approve';
  export const DEFAULT_RENOVATE_PR_LABEL = 'renovate';
  export const OPTIONAL_RENOVATE_PR_LABEL = 'optional';

  const defaultWorkflow = {
    name: 'upgrade-main',
    on: {
      // Run daily to update the renovate dependency dashboard issue with new updates
      schedule: [
        {
          cron: '0 0 * * MON-FRI',
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
            uses: 'actions/checkout@v3',
          },
          {
            name: 'Self-hosted Renovate',
            uses: 'renovatebot/github-action@v34.56.3',
            // Skip running renovate in a loop when renovate updates the dependency dashboard issue and re-triggers this workflow
            if: `(github.event_name != 'issues' && github.event_name != 'pull_request') || github.actor != '${RENOVATE_GITHUB_USERNAME}'`,
            with: {
              // projen creates this config for us
              configurationFile: 'renovate.json5',
              // Run projen as the cu-infra-svc-git user
              // We cannot use the default GITHUB_TOKEN to auth as explained here:
              // https://github.com/renovatebot/github-action#token
              token: 'x-access-token:${{ secrets.PROJEN_GITHUB_TOKEN }}',
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
        scheduleInterval: ['before 1am on Monday'],
        ignoreProjen: false,
        ignore: [
          'node', // managed by projen
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
              matchUpdateTypes: ['minor', 'patch'],
              // Tell renovate to enable github's auto merge feature on the PR
              automerge: options.autoMergeNonBreakingUpdates ? true : undefined,
              // Adding the auto-approve label will make projens auto approve workflow approve the PR so it will be auto merged
              addLabels: [options.autoMergeNonBreakingUpdates ? [AUTO_APPROVE_PR_LABEL] : undefined],
            },
            {
              matchDepTypes: ['optionalDependencies'],
              addLabels: [OPTIONAL_RENOVATE_PR_LABEL],
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
    new YamlFile(project, '.github/workflows/renovate.yml', { obj: { ...defaultWorkflow, ...override } });
  }
}
