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
  test('adds job to release workflow without service catalog options', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    datadogServiceCatalog.addServiceCatalogEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });

  test('adds job to release workflow with service catalog options', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    datadogServiceCatalog.addServiceCatalogEvent(project, serviceCatalogOptions);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
});
