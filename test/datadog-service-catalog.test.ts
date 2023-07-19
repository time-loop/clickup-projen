import path from 'path';
import { typescript, Testing } from 'projen';
import { datadogServiceCatalog } from '../src/datadog-service-catalog';

describe('addReleaseEvent', () => {
  const commonProjectOpts: typescript.TypeScriptProjectOptions = {
    defaultReleaseBranch: 'main',
    name: 'test-cdk',
  };
  const serviceCatalogOptions: datadogServiceCatalog.ServiceCatalogOptions = {
    serviceInfo: [
      {
        serviceName: 'test-service',
        description: 'test description test-service 1',
        application: 'clickup',
        tier: 'critical',
        lifecycle: 'unit-test',
        team: 'testing',
        pagerdutyUrl: 'https://test.pagerduty.com',
      },
      {
        team: 'testing',
      },
    ],
  };
  const serviceCatalogOptionsWithAllParameters: datadogServiceCatalog.ServiceCatalogOptions = {
    serviceInfo: [
      {
        serviceName: 'test-service',
        description: 'test description test-service 1',
        application: 'clickup',
        tier: 'critical',
        pagerdutyUrl: 'https://test.pagerduty.com',
      },
    ],
    squadContacts: [
      {
        name: 'contact test',
        type: datadogServiceCatalog.SquadContactType.EMAIL,
        contact: 'contacttest@clickup.com',
      },
    ],
    squadLinks: [
      {
        name: 'link test',
        type: datadogServiceCatalog.SquadLinkType.URL,
        url: 'https://test.clickup.com',
      },
      {
        name: 'staging link test',
        type: datadogServiceCatalog.SquadLinkType.URL,
        url: 'https://staging.clickup.com',
      },
    ],
    serviceTags: { tag1: 'tag1-test', tag2: 'tag2-test' },
  };

  test('adds job to release workflow with service catalog options', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    datadogServiceCatalog.addServiceCatalogEvent(project, serviceCatalogOptions);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });

  test('add send_service_catalog job with all parameters', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    datadogServiceCatalog.addServiceCatalogEvent(project, serviceCatalogOptionsWithAllParameters);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
});
