import { typescript, YamlFile } from 'projen';

export module addToProjectWorkflow {
  export const RENOVATE_GITHUB_USERNAME = 'cu-infra-svc-git';

  export const DEFAULT_RENOVATE_PR_LABEL = 'renovate';
  export const GITHUB_PROJECT_NUMBER = '3';

  const defaultWorkflow = {
    name: 'add-to-project',
    on: {
      pull_request: {
        types: ['opened', 'labeled'],
      },
    },
    // Prevent renovate running multiple times in parallel due to several subsequent trigger events occurring
    concurrency: {
      group: "${{ github.workflow }}-${{ github.event_name == 'workflow_dispatch' && github.event_name || '' }}",
    },
    jobs: {
      'add-to-project': {
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
            name: 'Add issue to project',
            uses: 'actions/add-to-project@v0.4.1',
            with: {
              // github project url
              'project-url': `https://github.com/orgs/time-loop/projects/${GITHUB_PROJECT_NUMBER}`,
              'github-token': 'x-access-token:${{ secrets.PROJEN_GITHUB_TOKEN }}',
              labeled: DEFAULT_RENOVATE_PR_LABEL,
            },
          },
        ],
      },
    },
  };

  export function addAddToProjectWorkflowYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/workflows/add-to-project.yml', { obj: { ...defaultWorkflow, ...override } });
  }
}
