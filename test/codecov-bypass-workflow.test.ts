import { Testing } from 'projen';
// import * as Yaml from 'yaml';

import { clickupCdk } from '../src/clickup-cdk';
import { codecovBypassWorkflow } from '../src/codecov-bypass-workflow';

describe('addCodecovBypassWorkflowYml - codecov-bypass .yml file added', () => {
  test('all default options', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp({
      cdkVersion: '2.91.0',
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codecovBypassWorkflow.addCodecovBypassWorkflowYml(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/codecov-bypass.yml']).toMatchSnapshot();
  });

  test('all options provided', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp({
      cdkVersion: '2.91.0',
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codecovBypassWorkflow.addCodecovBypassWorkflowYml(project, {
      workflowName: 'workflowName',
      CodecovGithubAppId: 111,
      githubAppId: 222,
      githubAppPrivateKey: 'github-app-private-key',
      skipLabel: 'skipLabel',
      checkName: 'checkName',
      checkSuiteCheckNames: ['checkSuiteCheckName1', 'checkSuiteCheckName2'],
      detailsUrl: 'some url',
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/codecov-bypass.yml']).toMatchSnapshot();
  });
});
