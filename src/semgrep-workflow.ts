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
          image: 'semgrep/semgrep@sha256:aeb24a8f042cb60fc64a87c6e52b01033fb11442fd224ccc41cc363f5ca3aa10', // 1.78.0
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
