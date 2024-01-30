import { Testing } from 'projen';

import { clickupCdk } from '../src/clickup-cdk';
import { codecovBypassWorkflow } from '../src/codecov-bypass-workflow';

describe('addCodecovBypassWorkflowYml - codecov-bypass .yml file added', () => {
  test('all default options', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp({
      cdkVersion: '2.91.0',
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codecovBypassWorkflow.addCodecovBypassWorkflowYml(project, {
      githubAppId: 'reference to some secret',
      githubAppPrivateKey: 'reference to some secret',
    });
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
      githubAppId: '${{ vars.GH_APP_ID_VAR_NAME }}',
      githubAppPrivateKey: 'r${{ secrets.GH_APP_ID_PRIVATE_KEY_SECRET_NAME }}',
      skipLabel: 'skipLabel',
      checkName: 'checkName',
      checkSuiteCheckNames: ['checkSuiteCheckName1', 'checkSuiteCheckName2'],
      detailsUrl: 'some url',
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/codecov-bypass.yml']).toMatchSnapshot();
  });
});
