import { Testing } from 'projen';
// import * as Yaml from 'yaml';

import { requiredParams } from './requiredParams';
import { cdkDiffWorkflow } from '../src/cdk-diff-workflow';
import { clickupCdk } from '../src/clickup-cdk';

describe('addCdkDiffWorkflowYml - cdk diff.yml file added', () => {
  test('a single env to diff', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stackSearchString: 'Qa',
        },
      ],
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });

  test('diff with roleDuration value set', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stackSearchString: 'Qa',
          roleDuration: 1800,
        },
      ],
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });

  test('node20', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp({
      ...requiredParams,
      workflowNodeVersion: '20.5.1',
    });
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stackSearchString: 'Qa',
        },
      ],
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });

  test('a single env to diff - single explicit stack given to diff', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stacks: ['UsQaSquadNameDynamoDBTableNameStack'],
        },
      ],
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });

  test('a single env to diff - multiple stacks given to diff', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stacks: ['UsQaSquadNameDynamoDBTableNameStack', 'UsQaSquadNameS3BucketNameStack'],
        },
      ],
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });

  test('multiple envs to diff', () => {
    const project = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
    cdkDiffWorkflow.addCdkDiffWorkflowYml(project, {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stackSearchString: 'Qa',
        },
        {
          name: 'staging',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-staging',
          labelToApplyWhenNoDiffPresent: 'staging-no-changes',
          stackSearchString: 'Staging',
        },
        {
          name: 'prod',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-prod',
          labelToApplyWhenNoDiffPresent: 'prod-no-changes',
          stackSearchString: 'Prod',
        },
      ],
    });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/cdk-diff.yml']).toMatchSnapshot();
  });
});
