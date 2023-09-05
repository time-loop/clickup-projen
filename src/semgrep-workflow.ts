import { typescript, YamlFile } from 'projen';

export module semgrepWorkflow {
  const defaultWorkflow = {
    name: 'Semgrep',
    on: {
      schedule: [
        {
          cron: '0 0 * * MON-FRI',
        },
      ],
      pull_request: {
        branches: ['main'],
      },
    },
    jobs: {
      semgrep: {
        name: 'Scan',
        'runs-on': 'ubuntu-latest',
        container: {
          image: 'returntocorp/semgrep@sha256:6c7ab81e4d1fd25a09f89f1bd52c984ce107c6ff33affef6ca3bc626a4cc479b',
        },
        steps: [
          {
            name: 'Checkout repository',
            uses: 'actions/checkout@v3',
          },
          {
            name: 'Run Semgrep CI',
            run: 'semgrep ci',
            env: {
              SEMGREP_APP_TOKEN: '${{ secrets.SEMGREP_APP_TOKEN }}',
            },
          },
        ],
      },
    },
  };

  export function addSemgrepWorkflowYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/workflows/semgrep.yml', { obj: { ...defaultWorkflow, ...override } });
  }
}
