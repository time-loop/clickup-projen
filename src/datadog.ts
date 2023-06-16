import { stringify } from 'cson-parser';
import { JobPermission } from 'projen/lib/github/workflows-model';
import { NodeProject } from 'projen/lib/javascript';

export module datadog {
  export interface ReleaseEventTags {
    /**
     *   @jsii ignore
     */
    [key: string]: string;
  }

  /**
   * Options to set for the event sent to Datadog on release.
   */
  export interface ReleaseEventOptions {
    /**
     * @default secrets.DD_PROJEN_RELEASE_API_KEY
     */
    readonly datadogApiKey?: string;
    /**
     * @default The release repo and semantically versioned release number
     */
    readonly eventTitle?: string;
    /**
     * @default The release repo and semantically versioned release number
     */
    readonly eventText?: string;
    /**
     * @default normal
     */
    readonly eventPriority?: 'normal' | 'low';
    /**
     * @default true
     */
    readonly datadogUs?: boolean;
    /**
     * Additional tags to append to the standard tags (project, release, version, actor)
     * @default undefined
     */
    readonly eventTags?: ReleaseEventTags;
  }

  /**
   * When passed in ReleaseEventOptions is rendered, this interface is the result
   * which is passed directly to the GitHub Action inputs. JSII does not like
   * snake_case exposed key names, hence the snake_case changes here in the
   * unexposed interface. All types are the same as ReleaseEventOptions except
   * where noted.
   * Based on: https://github.com/Glennmen/datadog-event-action/releases/tag/1.1.0
   */
  interface ReleaseEventActionInputs {
    readonly datadog_api_key: string;
    readonly event_title: string;
    readonly event_text: string;
    readonly event_priority: 'normal' | 'low';
    readonly datadog_us: boolean;
    /**
     * Formatted as an array of stringified, colon delimited key:value pairs.
     * Example: '["Key1:Val1", "Key2:Val2"]'
     */
    readonly event_tags: string;
  }

  /**
   * Adds a 'send Datadog release event' job to the release workflow, if it exists.
   * Uses the DD_PROJEN_RELEASE_API_KEY for authentication to Datadog.
   *
   * @param project The NodeProject to which the release event workflow will be added
   * @param opts Optional properties to send along with the DD release event
   */
  export function addReleaseEvent(project: NodeProject, opts?: ReleaseEventOptions) {
    project.release?.addJobs({
      send_release_event: {
        name: 'Send Release Event',
        permissions: {
          contents: JobPermission.READ,
        },
        runsOn: ['ubuntu-latest'],
        needs: ['release'],
        if: 'needs.release.outputs.latest_commit == github.sha',
        env: {
          CI: 'true',
        },
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
            name: 'Send Datadog event',
            // https://github.com/Glennmen/datadog-event-action/releases/tag/1.1.0
            uses: 'Glennmen/datadog-event-action@fb18624879901f1ff0c3c7e1e102179793bfe948',
            with: setReleaseEventInputs(project, opts),
          },
        ],
      },
    });
  }

  function parseReleaseEventTags(tags: ReleaseEventTags): string {
    const tagsArr = Object.keys(tags).map((key) => `${key}:${tags[key]}`);
    return stringify(tagsArr);
  }

  function setReleaseEventInputs(project: NodeProject, opts?: ReleaseEventOptions): ReleaseEventActionInputs {
    const defaultTags: ReleaseEventTags = {
      project: project.name,
      release: 'true',
      version: '${{ steps.event_metadata.outputs.release_tag }}',
      actor: '${{ github.actor }}',
    };
    const rendered: ReleaseEventActionInputs = {
      datadog_api_key: opts?.datadogApiKey ?? '${{ secrets.DD_PROJEN_RELEASE_API_KEY }}',
      datadog_us: opts?.datadogUs ?? true,
      event_title:
        opts?.eventTitle ?? `Released ${project.name} version \${{ steps.event_metadata.outputs.release_tag }}`,
      event_text:
        opts?.eventText ?? `Released ${project.name} version \${{ steps.event_metadata.outputs.release_tag }}`,
      event_priority: opts?.eventPriority ?? 'normal',
      event_tags: parseReleaseEventTags({ ...defaultTags, ...opts?.eventTags }),
    };
    return rendered;
  }
}
