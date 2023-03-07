import { typescript, YamlFile } from 'projen';

export module codeqlWorkflow {
  const defaultWorkflow = {
    name: 'CodeQL',
    on: {
      schedule: [
        {
          cron: '0 0 * * WED',
        },
      ],
      workflow_dispatch: {},
      push: {
        branches: ['main'],
      },
      pull_request: {
        branches: ['main'],
      },
    },
    jobs: {
      analyze: {
        name: 'Analyze',
        if: "github.event.pull_request.draft == false && github.event.pull_request.user.login != 'clickup-backend-bot' && github.event.pull_request.user.login != 'dependabot'",
        'runs-on': 'ubuntu-latest',
        permissions: {
          actions: 'read',
          contents: 'read',
          'security-events': 'write',
        },
        strategy: {
          'fail-fast': 'false',
          matrix: {
            language: ['javascript'],
          },
        },
        steps: [
          {
            name: 'Checkout repository',
            uses: 'actions/checkout@2541b1294d2704b0964813337f33b291d3f8596b', // tag=v3.0.2
          },
          {
            name: 'Initialize CodeQL',
            uses: 'github/codeql-action/init@32dc499307d133bb5085bae78498c0ac2cf762d5', // tag=v2.2.5
            with: {
              languages: '${{ matrix.language }}',
            },
          },
          {
            name: 'Perform CodeQL Analysis',
            uses: 'github/codeql-action/analyze@32dc499307d133bb5085bae78498c0ac2cf762d5', // tag=v2.2.5
          },
        ],
      },
    },
  };

  export function addCodeqlWorkflowYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/workflows/codeql-analysis.yml', { obj: { ...defaultWorkflow, ...override } });
  }
}
