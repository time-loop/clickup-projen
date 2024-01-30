import { YamlFile } from 'projen';
import { clickupCdk } from './clickup-cdk';

const CODECOV_GITHUB_APP_ID = 254;

export module codecovBypassWorkflow {
  function createCodecovBypassWorkflow(options?: CodecovBypassOptionsConfig) {
    const defaultWorkflow = {
      name: options?.workflowName || 'Code coverage increased',
      on: {
        check_suite: {
          types: ['completed'],
        },
        pull_request: {
          types: ['labeled', 'unlabeled'],
        },
      },
      permissions: {},
      jobs: {
        'code-coverage-increased': {
          'runs-on': 'ubuntu-latest',
          if: `github.event_name != \'check_suite\' || github.event.check_suite.app.id == ${CODECOV_GITHUB_APP_ID}`,
          steps: [
            {
              name: 'Check codecov results',
              uses: 'time-loop/github-actions/dist/wrap-check-suite@wrap-check-suite+0.3.2',
              env: {
                FORCE_COLOR: 3,
              },
              with: {
                'github-app-id': options?.githubAppId || '${{ vars.CODECOV_GITHUB_APP_ID }}',
                'github-private-key': options?.githubAppPrivateKey || '${{ secrets.CODECOV_GITHUB_APP_PRIVATE_KEY }}',
                'skip-label': options?.skipLabel || 'code coverage not required',
                'check-name': options?.checkName || 'Code coverage increased',
                'check-suite-app-id': CODECOV_GITHUB_APP_ID,
                'check-suite-check-names': options?.checkSuiteCheckNames?.join(',') || 'codecov/patch,codecov/project',
                'details-url':
                  options?.detailsUrl || 'https://app.codecov.io/gh/${{ github.repository }}/pull/<% prNumber %>',
              },
            },
          ],
        },
      },
    };

    return defaultWorkflow;
  }

  export interface CodecovBypassOptionsConfig {
    /**
     * GitHub App ID
     * @default '${{ vars.CODECOV_GITHUB_APP_ID }}'
     */
    readonly githubAppId?: string;

    /**
     * GitHub App Private Key
     * @default '${{ secrets.CODECOV_GITHUB_APP_PRIVATE_KEY }}'
     */
    readonly githubAppPrivateKey?: string;

    /**
     * Skip creating (using) the workflow
     * @default false
     */
    readonly disabled?: boolean;

    /**
     * Workflow Name
     * @default 'Code coverage increased'
     */
    readonly workflowName?: string;

    /**
     * Skip Label
     * @default 'code coverage not required'
     */
    readonly skipLabel?: string;

    /**
     * Check Name
     * @default 'Code coverage increased'
     */
    readonly checkName?: string;

    /**
     * Check Suite Check Names
     * @default ['codecov/patch', 'codecov/project']
     */
    readonly checkSuiteCheckNames?: string[];

    /**
     * Details URL
     * @default 'https://app.codecov.io/gh/${{ github.repository }}/pull/<% prNumber %>'
     */
    readonly detailsUrl?: string;
  }

  export function getCodecovBypassOptions(options?: CodecovBypassOptionsConfig) {
    return options;
  }

  export function addCodecovBypassWorkflowYml(
    project: clickupCdk.ClickUpCdkTypeScriptApp,
    options?: CodecovBypassOptionsConfig,
    override?: any,
  ): void {
    if (options?.disabled) {
      return;
    }
    new YamlFile(project, '.github/workflows/codecov-bypass.yml', {
      obj: { ...createCodecovBypassWorkflow(options), ...override },
    });
  }
}
