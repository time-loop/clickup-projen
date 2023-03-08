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
        'runs-on': 'ubuntu-latest',
        permissions: {
          actions: 'read',
          contents: 'read',
          'security-events': 'write',
        },
        strategy: {
          matrix: {
            language: ['javascript'],
          },
        },
        steps: [
          {
            name: 'Checkout repository',
            uses: 'actions/checkout@v3',
          },
          {
            name: 'Initialize CodeQL',
            uses: 'github/codeql-action/init@v2',
            with: {
              languages: '${{ matrix.language }}',
            },
          },
          {
            name: 'Perform CodeQL Analysis',
            uses: 'github/codeql-action/analyze@v2',
          },
        ],
      },
    },
  };

  export function addCodeqlWorkflowYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/workflows/codeql-analysis.yml', { obj: { ...defaultWorkflow, ...override } });
  }
}
