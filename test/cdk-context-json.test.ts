import { awscdk, Testing } from 'projen';
import { requiredParams } from './requiredParams';
import { cdkContextJson } from '../src/cdk-context-json';

describe('injectAwsAuthIntoBuild', () => {
  const project = new awscdk.AwsCdkTypeScriptApp(requiredParams);
  const lookupAccountId = '123412341234';
  cdkContextJson.injectAwsAuthIntoBuild(project, {
    lookupAccountId,
  });
  const synth = Testing.synth(project);

  test('updates build WF', () => {
    // This is fragile. It'll probably break when we update the underlying projen.
    // The better thing to do is to dig into the file and validate
    // permissions + id-token: write
    // and that the AWS credentials step is added.
    expect(synth['.github/workflows/build.yml']).toMatchSnapshot();
  });
});

describe('addOidcRoleStack', () => {
  const project = new awscdk.AwsCdkTypeScriptApp(requiredParams);
  cdkContextJson.addOidcRoleStack(project);
  const synth = Testing.synth(project);
  test('adds stack definition', () => {
    expect(synth['src/github-actions-oidc-cdk-context-lookup-role.ts']).toMatchSnapshot();
  });
});
