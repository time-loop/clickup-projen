import { YamlFile } from 'projen';
import { clickupCdk } from './clickup-cdk';

const DEFAULT_CODECOV_GITHUB_APP_ID = 254;

export module codecovBypassWorkflow {
  function CreateCodecovBypassWorkflow(options?: CodecovBypassOptionsConfig) {
    const defaultWorkflow = {
      name: options?.workflowName || 'Code coverage increased',
      on: {
        check_suite: {
          types: ['completed'],
        },
        pull_request: {
          types: ['labelled', 'unlabeled'],
        },
      },
      permissions: {},
      jobs: {
        'code-coverage-increased': {
          'runs-on': 'ubuntu-latest',
          if: `github.event_name == \'check_suite\' || github.event.check_suite.app.id == ${options?.CodecovGithubAppId || DEFAULT_CODECOV_GITHUB_APP_ID}`,
          steps: [
            {
              name: 'Check codecov results',
              uses: 'time-loop/github-actions/dist/wrap-check-suite@wrap-check-suite+0.3.2',
              env: {
                FORCE_COLOR: 3,
              },
              with: {
                'github-app-id': options?.githubAppId || '${{ secrets.CLICKUP_GITHUB_BOT_APP_ID }}',
                'github-private-key': options?.githubAppPrivateKey || '${{ secrets.CLICKUP_GITHUB_BOT_PRIVATE_KEY }}',
                'skip-label': options?.skipLabel || 'code coverage not required',
                'check-name': options?.checkName || 'Code coverage increased',
                'check-suite-app-id': options?.CodecovGithubAppId || DEFAULT_CODECOV_GITHUB_APP_ID,
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
     * Workflow Name
     */
    readonly workflowName?: string;

    /**
     * Codecov Github App ID
     */
    readonly CodecovGithubAppId?: number;

    /**
     * GitHub App ID
     */
    readonly githubAppId?: number;

    /**
     * GitHub App Private Key
     */
    readonly githubAppPrivateKey?: string;

    /**
     * Skip Label
     */
    readonly skipLabel?: string;

    /**
     * Check Name
     */
    readonly checkName?: string;

    /**
     * Check Suite Check Names
     */
    readonly checkSuiteCheckNames?: string[];

    /**
     * Details URL
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
    new YamlFile(project, '.github/workflows/codecov-bypass.yml', {
      obj: { ...CreateCodecovBypassWorkflow(options), ...override },
    });
  }
}
