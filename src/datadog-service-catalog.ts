import { JobPermission, JobStep } from 'projen/lib/github/workflows-model';
import { NodeProject } from 'projen/lib/javascript';

export module datadogServiceCatalog {
  export interface ServiceInfo {
    /**
     * The name of the service. This must be unique across all services.
     * @default project.name
     */
    readonly serviceName?: string;
    /**
     * Some details on what this service does
     */
    readonly description?: string;
    /**
     * The application/product that this service assists
     */
    readonly application?: string;
    /**
     * Which squad owns this service
     */
    readonly team?: string;
    /**
     * Where is this service in the development cycle (development, staging, production, deprecated)
     * @default 'not-defined'
     */
    readonly lifecycle?: string;
    /**
     * How important is this service for business functionality (low, medium, high, critical)
     * @default 'low'
     */
    readonly tier?: string;
    /**
     * The PagerDuty URL for the service.
     */
    readonly pagerdutyUrl?: string;
  }
  export enum SquadContactType {
    EMAIL = 'email',
    SLACK = 'slack',
    MICROSOFT_TEAMS = 'microsoft-teams',
  }
  export interface SquadContact {
    /**
     * The name of the contact.
     */
    readonly name: string;
    /**
     * The type of the contact. Acceptable values are: email, slack, and microsoft-teams
     */
    readonly type: SquadContactType;
    /**
     * The actual contact information for the contact. For example, if the type is email, this would be the email address.
     */
    readonly contact: string;
  }
  export enum SquadLinkType {
    DOC = 'doc',
    WIKI = 'wiki',
    RUNBOOK = 'runbook',
    URL = 'url',
    REPO = 'repo',
    DASHBOARD = 'dashboard',
    ONCALL = 'oncall',
    CODE = 'code',
    LINK = 'link',
  }
  export interface SquadLink {
    /**
     * The name of the link.
     */
    readonly name: string;
    /**
     * The type for the link. Acceptable values are: 'doc', 'wiki', 'runbook', 'url', 'repo', 'dashboard', 'oncall', 'code', and 'link'
     */
    readonly type: SquadLinkType;
    /**
     * The URL of the link.
     */
    readonly url: string;
  }
  export interface ServiceTags {
    /**
     *  The list of tags that are associated with the service.
     */
    readonly tags: Record<string, string>;
  }
  /**
   * Service Catalog Options.
   */
  export interface ServiceCatalogOptions {
    /**
     * Information about the service that will be published to the service catalog.
     */
    readonly serviceInfo?: ServiceInfo[];
    /**
     * The list of contacts for the service. Each of these contacts is an object with the following properties: name, type, and contact.
     * @default undefined
     */
    readonly squadContacts?: SquadContact[];
    /**
     * A list of links associated with the service. Each of these links is an object with the following properties: name, type, and url.
     * @default undefined
     */
    readonly squadLinks?: SquadLink[];
    /**
     * The list of tags that are associated with the service.
     * @default undefined
     */
    readonly serviceTags?: ServiceTags;
  }

  /**
   * Adds 'Send to Datadog Service Catalog' job to the release workflow.
   *
   * @param project The NodeProject to which the release event workflow will be added
   * @param opts Optional: Service information that will be included in the DD Service Catalog.
   */
  export function addServiceCatalogEvent(project: NodeProject, opts?: ServiceCatalogOptions) {
    project.release?.addJobs({
      send_service_catalog: {
        name: 'Send to Datadog Service Catalog',
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
          ...createServiceCatalogJobSteps(project, opts),
        ],
      },
    });
  }

  function createServiceCatalogJobSteps(project: NodeProject, options?: ServiceCatalogOptions): JobStep[] {
    let steps: JobStep[] = [];

    for (const serviceInfo of options?.serviceInfo ?? []) {
      const serviceName = serviceInfo?.serviceName ?? project.name;
      const step: JobStep = {
        name: `Publish DD Service Catalog - ${serviceName}`,
        uses: 'arcxp/datadog-service-catalog-metadata-provider@v2',
        with: {
          'service-version': 'v2.1',
          'datadog-hostname': 'app.datadoghq.com',
          'datadog-key': '${{ secrets.DATADOG_API_KEY }}',
          'datadog-app-key': '${{ secrets.DATADOG_APPLICATION_KEY }}',
          'service-name': `${serviceName}`,
          description: `${serviceInfo.description}` ?? 'not-defined',
          application: `${serviceInfo.application}` ?? 'clickup',
          tier: `${serviceInfo.tier}` ?? 'low',
          lifecycle: `${serviceInfo.lifecycle}` ?? 'not-defined',
          team: `${serviceInfo.team}` ?? 'not-defined',
          pagerdutyUrl: `${serviceInfo.pagerdutyUrl}` ?? 'not-defined',
        },
      };
      steps.push(step);
    }
    return steps;
  }
}
