import { JobPermission, JobStep } from 'projen/lib/github/workflows-model';
import { NodeProject } from 'projen/lib/javascript';
import { defaultServiceCatalogValues } from './utils/parameters';

export module datadogServiceCatalog {
  export interface ServiceInfo {
    /**
     * The name of the service. This must be unique across all services.
     * @default project.name
     */
    readonly serviceName?: string;
    /**
     * Some details on what this service does
     * @default 'Not Provided'
     */
    readonly description?: string;
    /**
     * The application/product that this service assists
     * @default 'clickup'
     */
    readonly application?: string;
    /**
     * Which squad owns this service
     */
    readonly team?: string;
    /**
     * Where is this service in the development cycle (development, staging, production, deprecated)
     * @default 'Not Provided'
     */
    readonly lifecycle?: string;
    /**
     * How important is this service for business functionality (low, medium, high, critical)
     * @default 'low'
     */
    readonly tier?: string;
    /**
     * The PagerDuty URL for the service.
     * @default 'Not Provided'
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
    RUNBOOK = 'runbook',
    REPO = 'repo',
    DASHBOARD = 'dashboard',
    OTHER = 'other',
  }
  export interface SquadLink {
    /**
     * The name of the link.
     */
    readonly name: string;
    /**
     * The type for the link. Acceptable values are: 'doc', 'runbook', 'repo', 'dashboard', and 'other'
     */
    readonly type: SquadLinkType;
    /**
     * The URL of the link.
     */
    readonly url: string;
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
    readonly serviceTags?: Record<string, string>;
  }

  /**
   * Adds 'Send to Datadog Service Catalog' job to the release workflow.
   *
   * @param project The NodeProject to which the release event workflow will be added
   * @param options Service information that will be included in the DD Service Catalog.
   */
  export function addServiceCatalogEvent(project: NodeProject, options: ServiceCatalogOptions) {
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
          ...createServiceCatalogJobSteps(project, options),
        ],
      },
    });
  }

  /**
   * Creates one JobStep for each serviceInfo record in the ServiceCatalogOptions.
   *
   * @param project
   * @param options
   * @returns
   */
  function createServiceCatalogJobSteps(project: NodeProject, options: ServiceCatalogOptions): JobStep[] {
    let steps: JobStep[] = [];
    const serviceTags = mergeServiceTags(project, options.serviceTags);
    for (const serviceInfo of options.serviceInfo ?? []) {
      const serviceName = serviceInfo?.serviceName ?? project.name;
      const step: JobStep = {
        name: `Publish DD Service Catalog for ${serviceName}`,
        uses: 'arcxp/datadog-service-catalog-metadata-provider@v2',
        with: {
          'service-version': `${defaultServiceCatalogValues.SERVICE_VERSION}`,
          'datadog-hostname': `${defaultServiceCatalogValues.DATADOG_HOSTNAME}`,
          'datadog-key': `${defaultServiceCatalogValues.DATADOG_KEY}`,
          'datadog-app-key': `${defaultServiceCatalogValues.DATADOG_APP_KEY}`,
          'service-name': `${serviceName}`,
          description: `${serviceInfo.description ?? defaultServiceCatalogValues.NOT_PROVIDED}`,
          application: `${serviceInfo.application ?? defaultServiceCatalogValues.APPLICATION}`,
          tier: `${serviceInfo.tier ?? defaultServiceCatalogValues.TIER}`,
          lifecycle: `${serviceInfo.lifecycle ?? defaultServiceCatalogValues.NOT_PROVIDED}`,
          team: `${serviceInfo.team ?? defaultServiceCatalogValues.NOT_PROVIDED}`,
          pagerdutyUrl: `${serviceInfo.pagerdutyUrl ?? defaultServiceCatalogValues.NOT_PROVIDED}`,
          'slack-support-channel': `${defaultServiceCatalogValues.SLACK_SUPPORT_CHANNEL}`,
          contacts: `${options.squadContacts?.map(
            (contact) => `
- type: ${contact.type}
  contact: ${contact.contact}
  name: ${contact.name}`,
          )}`,
          links: `${options.squadLinks?.map(
            (link) => ` 
- type: ${link.type}
  url: ${link.url}
  name: ${link.name}`,
          )}`,
          tags: `${Object.keys(serviceTags).map(
            (key) => `
- ${key}:${serviceTags[key]}`,
          )}`,
        },
      };
      steps.push(step);
    }
    return steps;
  }

  /**
   * return the service tags that will be send to Datadog.
   *
   * @param project
   * @param userTags
   * @returns
   */
  function mergeServiceTags(project: NodeProject, userTags?: Record<string, string>): Record<string, string> {
    const defaultTags: Record<string, string> = {
      project: project.name,
      release: 'true',
      version: '${{ steps.event_metadata.outputs.release_tag }}',
      actor: '${{ github.actor }}',
    };
    return { ...defaultTags, ...userTags };
  }
}
