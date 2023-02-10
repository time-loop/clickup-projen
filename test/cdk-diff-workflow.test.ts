import { typescript, Testing } from 'projen';

import { cdkDiffWorkflow } from '../src/cdk-diff-workflow';

describe('addCdkDiffWorkflowYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      oidcQaRoleArn: 'squad-github-actions-oidc-role-name-qa',
      oidcStagingRoleArn: 'squad-github-actions-oidc-role-name-staging',
      oidcProdRoleArn: 'squad-github-actions-oidc-role-name-prod',
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });
});
