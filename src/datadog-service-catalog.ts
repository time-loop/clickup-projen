import { JobPermission, JobStep } from 'projen/lib/github/workflows-model';
import { NodeProject } from 'projen/lib/javascript';

export module datadogServiceCatalog {
  export enum DefaultServiceCatalogValues {
    SERVICE_VERSION = '2.1',
    DATADOG_HOSTNAME = 'app.datadoghq.com',
    DATADOG_KEY = '${{ secrets.DD_PROJEN_RELEASE_API_KEY }}',
    DATADOG_APP_KEY = '${{ secrets.DD_PROJEN_RELEASE_APP_KEY }}',
    SLACK_SUPPORT_CHANNEL = 'https://click-up.slack.com/archives/C043T0JBJKY',
    TIER = 'low',
    NOT_PROVIDED = 'Not Provided',
  }
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
     * @default 'Not Provided'
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
  export enum ContactType {
    EMAIL = 'email',
    SLACK = 'slack',
    MICROSOFT_TEAMS = 'microsoft-teams',
  }
  export interface ContactInfo {
    /**
     * The name of the contact.
     */
    readonly name: string;
    /**
     * The type of the contact. Acceptable values are: email, slack, and microsoft-teams
     */
    readonly type: ContactType;
    /**
     * The actual contact information for the contact. For example, if the type is email, this would be the email address.
     */
    readonly contact: string;
  }
  export enum LinkType {
    DOC = 'doc',
    RUNBOOK = 'runbook',
    REPO = 'repo',
    DASHBOARD = 'dashboard',
    OTHER = 'other',
  }
  export interface LinkInfo {
    /**
     * The name of the link.
     */
    readonly name: string;
    /**
     * The type for the link. Acceptable values are: 'doc', 'runbook', 'repo', 'dashboard', and 'other'
     */
    readonly type: LinkType;
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
     * Information about the services that will be published to the service catalog.
     */
    readonly serviceInfo?: ServiceInfo[];
    /**
     * The list of contacts for the service. Each of these contacts is an object with the following properties: name, type, and contact.
     * @default undefined
     */
    readonly contacts?: ContactInfo[];
    /**
     * A list of links associated with the service. Each of these links is an object with the following properties: name, type, and url.
     * @default undefined
     */
    readonly links?: LinkInfo[];
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

      const contacts = `${options.contacts?.map(
        (contact) => `
- type: ${contact.type}
  contact: ${contact.contact}
  name: ${contact.name}`,
      )}`;

      const links = `${options.links?.map(
        (link) => `
- type: ${link.type}
  url: ${link.url}
  name: ${link.name}`,
      )}`;

      const tags = `${Object.keys(serviceTags).map(
        (key) => `
- ${key}:${serviceTags[key]}`,
      )}`;

      const step: JobStep = {
        name: `Publish DD Service Catalog for ${serviceName}`,
        uses: 'arcxp/datadog-service-catalog-metadata-provider@v2',
        with: {
          'schema-version': `${DefaultServiceCatalogValues.SERVICE_VERSION}`,
          'datadog-hostname': `${DefaultServiceCatalogValues.DATADOG_HOSTNAME}`,
          'datadog-key': `${DefaultServiceCatalogValues.DATADOG_KEY}`,
          'datadog-app-key': `${DefaultServiceCatalogValues.DATADOG_APP_KEY}`,
          'service-name': `${serviceName}`,
          description: `${serviceInfo.description ?? DefaultServiceCatalogValues.NOT_PROVIDED}`,
          application: `${serviceInfo.application ?? DefaultServiceCatalogValues.NOT_PROVIDED}`,
          tier: `${serviceInfo.tier ?? DefaultServiceCatalogValues.TIER}`,
          lifecycle: `${serviceInfo.lifecycle ?? DefaultServiceCatalogValues.NOT_PROVIDED}`,
          team: `${serviceInfo.team ?? DefaultServiceCatalogValues.NOT_PROVIDED}`,
          pagerdutyUrl: `${serviceInfo.pagerdutyUrl ?? DefaultServiceCatalogValues.NOT_PROVIDED}`,
          'slack-support-channel': `${DefaultServiceCatalogValues.SLACK_SUPPORT_CHANNEL}`,
          contacts,
          links,
          tags,
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
