import { JobPermission } from 'projen/lib/github/workflows-model';
import { NodeProject } from 'projen/lib/javascript';

export module slackAlert {
  /**
   * Options to set for the event sent to Slack on release.
   */
  export interface ReleaseEventOptions {
    /**
     * @default secrets.PROJEN_RELEASE_SLACK_WEBHOOK
     */
    readonly webhook?: string;

    /**
     * Override the default slack message title
     */
    readonly messageTitle?: string;

    /**
     * Override the default slack message body
     */
    readonly messageBody?: string;
  }

  /**
   * Options to add to interface for projects that wish to off send slack functionality.
   */
  export interface SendSlackOptions {
    /**
     * Should we send a slack webhook on release (required for compliance audits)
     *
     * @default true
     */
    readonly sendSlackWebhookOnRelease?: boolean;

    /**
     * Slack alert on release options. Only valid when `sendSlackWebhookOnRelease` is true.
     */
    readonly sendSlackWebhookOnReleaseOpts?: slackAlert.ReleaseEventOptions;
  }

  /**
   * Adds a 'Send Release Alert to Slack' job to the release workflow, if it exists.
   * Uses the PROJEN_RELEASE_SLACK_WEBHOOK for authentication to Datadog.
   *
   * @param project The NodeProject to which the release event workflow will be added
   * @param opts Optional properties to send along with the DD release event
   */
  export function addReleaseEvent(project: NodeProject, opts?: ReleaseEventOptions) {
    project.release?.addJobs({
      send_release_event_to_slack: {
        name: 'Send Release Alert to Slack',
        permissions: {
          contents: JobPermission.READ,
        },
        runsOn: ['ubuntu-latest'],
        needs: ['release'],
        if: 'needs.release.outputs.latest_commit == github.sha',
        steps: [
          {
            name: 'Download build artifacts',
            uses: 'actions/download-artifact@v3',
            with: {
              name: 'build-artifact',
              path: project.release!.artifactsDirectory,
            },
          },
          {
            name: 'Get version',
            id: 'event_metadata',
            run: `echo "release_tag=$(cat ${project.release!.artifactsDirectory}/releasetag.txt)" >> $GITHUB_OUTPUT`,
          },
          {
            name: 'Send Slack webhook event',
            uses: 'rtCamp/action-slack-notify@12e36fc18b0689399306c2e0b3e0f2978b7f1ee7',
            env: {
              SLACK_TITLE:
                opts?.messageTitle ??
                '${{ github.repository }}@${{ steps.event_metadata.outputs.release_tag }} released!',
              SLACK_MESSAGE:
                opts?.messageBody ??
                'View the release notes here: https://github.com/${{ github.repository }}/releases/tag/${{ steps.event_metadata.outputs.release_tag }}',
              SLACK_WEBHOOK: opts?.webhook ?? '${{ secrets.PROJEN_RELEASE_SLACK_WEBHOOK }}',
              SLACK_FOOTER: '',
              SLACK_COLOR: 'success',
              MSG_MINIMAL: 'true',
            },
          },
        ],
      },
    });
  }
}
