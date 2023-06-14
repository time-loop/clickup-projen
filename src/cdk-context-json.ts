import { awscdk, JsonPatch, SampleFile } from 'projen';

export module cdkContextJson {
  export interface InjectionOptions {
    /**
     * The account number where the role the GH actions will assume lives.
     * This is usually the same account running cdk-pipelines,
     * but can be any account which has been configured with
     *
     * ```ts
     * cdk bootstrap --trust-for-lookup $this_account_number ...
     * ```
     */
    readonly lookupAccountId: string;
    /**
     * Which region should GH Auth into?
     * @default 'us-west-2'
     */
    readonly awsRegion?: string;
    /**
     * How long should the requested role be valid.
     * @default 900 15min seems pretty generous.
     */
    readonly roleDurationSeconds?: number;
  }

  /**
   * Options to support cdk.context.json management
   */
  export interface Options {
    /**
     * @default - do not create stack SampleCode for OIDC role
     */
    readonly createOidcRoleStack?: boolean;
    /**
     * You must configure this if you want to self-mutation cdk.context.json.
     *
     * @default - do not modify the build workflow to authorize against AWS.
     */
    readonly injectionOptions?: InjectionOptions;
  }

  export function injectAwsAuthIntoBuild(project: awscdk.AwsCdkTypeScriptApp, options: InjectionOptions): void {
    const build = project.tryFindObjectFile('.github/workflows/build.yml');
    build?.addOverride('jobs.build.permissions', { 'id-token': 'write' });
    build?.patch(
      JsonPatch.add('/jobs/build/steps/0', {
        name: 'Configure AWS Credentials',
        uses: 'aws-actions/configure-aws-credentials@v2',
        with: {
          'aws-region': options.awsRegion ?? 'us-west-2',
          'role-to-assume': `arn:aws:iam::${options.lookupAccountId}:role/${project.name}-github-actions-role`,
          'role-duration-seconds': options.roleDurationSeconds ?? 900,
        },
      }),
    );
  }

  export function addOidcRoleStack(project: awscdk.AwsCdkTypeScriptApp): void {
    new SampleFile(project, `${project.srcdir}/github-actions-oidc-cdk-context-lookup-role.ts`, {
      contents: `import { core } from '@time-loop/cdk-library';
import { aws_iam, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Namer } from 'multi-convention-namer';

export class GitHubActionsOIDCCdkContextLookupRole extends core.Stack {
  static asStage(scope: Construct, stageName: string, stageProps: core.StageProps): Stage {
    return new (class extends Stage {
      constructor() {
        super(scope, stageName, stageProps);
        new GitHubActionsOIDCCdkContextLookupRole(this, stageProps);
      }
    })();
  }
  constructor(scope: Construct, props: core.StackProps) {
    const projectName = '${project.name}';
    // NOTE: you should never deploy this anywhere but the cdkPipelines account
    // And the GitHubActionsOIDCPermissions class for cdk-diff should never be deployed
    // in the cdkPipelines account. Name collision is intentional here.
    let id = new Namer([...projectName.split('-'), 'github', 'actions']);
    super(scope, id, props);

    const githubActionsRoleName = id.addSuffix(['role']).kebab;
    const githubActionsRole = new aws_iam.Role(this, githubActionsRoleName, {
      roleName: githubActionsRoleName,
      assumedBy: new aws_iam.FederatedPrincipal(
        \`arn:aws:iam::\${this.account}:oidc-provider/token.actions.githubusercontent.com\`,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': \`repo:time-loop/\${projectName}:*\`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    const githubActionsPolicyName = id.addSuffix(['policy']).kebab;
    const githubActionsPolicy = new aws_iam.Policy(this, githubActionsPolicyName, {
      policyName: githubActionsPolicyName,
      statements: [
        new aws_iam.PolicyStatement({
          actions: [ 'sts:AssumeRole' ],
          resources: [ 'arn:aws:iam::*:role/cdk-*lookup-role*' ],
        }),
      ],
    });

    // Attach IAM policy to IAM role
    githubActionsPolicy.attachToRole(githubActionsRole);
  }
}
`,
    });
  }
}
