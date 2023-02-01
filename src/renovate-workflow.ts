import { typescript, YamlFile, RenovatebotOptions } from 'projen';
import merge from 'ts-deepmerge';

export module renovateWorkflow {
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
            if: "(github.event_name != 'issues' && github.event_name != 'pull_request') || github.actor != 'cu-infra-svc-git'",
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

  export function getRenovateOptions(customOptions: Partial<RenovatebotOptions> = {}) {
    return merge(
      {
        scheduleInterval: ['before 1am on Monday'],
        ignoreProjen: false,
        ignore: [
          // managed by projen
          'node',
        ],
        overrideConfig: {
          rangeStrategy: 'bump',
          extends: ['config:base', 'group:allNonMajor', 'group:recommended', 'group:monorepos'],
        },
      },
      customOptions,
    );
  }

  export function addRenovateWorkflowYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/workflows/renovate.yml', { obj: { ...defaultWorkflow, ...override } });
  }
}
