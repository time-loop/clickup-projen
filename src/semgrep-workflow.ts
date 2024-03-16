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
          // Reocurring task to check the pinned version SEC-8540
          image: 'semgrep/semgrep@sha256:d08d065e4041a222e7b54ed2ad8faddfef978bcc210aa9d0b6da93d251082808',
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
