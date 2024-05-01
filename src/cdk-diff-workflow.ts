import { SampleFile, YamlFile } from 'projen';
import { NodePackage } from 'projen/lib/javascript';
import { clickupCdk } from './clickup-cdk';
import { OptionalNodeVersion } from './optional-node-version';
import { parameters } from './utils/parameters';

export module cdkDiffWorkflow {
  function createCdkDiffWorkflow(options: CDKDiffOptionsConfig) {
    const defaultWorkflow = {
      name: 'cdk-diff',
      on: {
        pull_request: {},
        workflow_dispatch: {},
      },
      permissions: {
        'id-token': 'write',
        contents: 'write',
        'pull-requests': 'write',
      },
      jobs: {
        diff: {
          'runs-on': 'ubuntu-latest',
          env: {
            CI: 'true',
            REPO_NAME: '${{ github.event.repository.name }}',
          },
          steps: [
            {
              name: 'Checkout',
              uses: 'actions/checkout@v3',
              with: {
                ref: '${{ github.event.pull_request.head.ref }}',
                repository: '${{ github.event.pull_request.head.repo.full_name }}',
              },
            },
            {
              name: 'GitHub Packages authorization',
              run: [
                'cat > .npmrc <<EOF',
                '//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
                '@time-loop:registry=https://npm.pkg.github.com/',
                'EOF',
              ].join('\n'),
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v3',
              with: {
                'node-version': options.nodeVersion ?? parameters.PROJEN_NODE_VERSION,
              },
            },
            {
              name: 'Install dependencies',
              run: 'yarn install --check-files',
            },
            createStackCaptureStep(options.envsToDiff),
            ...createDiffSteps(options.envsToDiff).flat(),
            createCdkNotifierStep(options.envsToDiff),
            ...createLabelRemovalSteps(options.envsToDiff),
            ...createLabelSteps(options.envsToDiff),
            {
              name: 'Should auto merge',
              id: 'should-auto-merge',
              if: `${getAutoMergeConditions(
                options.envsToDiff,
              )} && github.event.pull_request.user.login == 'cu-infra-svc-git'`,
              run: 'echo "auto-merge=true" >> $GITHUB_OUTPUT',
            },
            {
              name: 'Enable automerge',
              uses: 'daneden/enable-automerge-action@v1.0.2',
              if: 'steps.should-auto-merge.outputs.auto-merge',
              with: {
                'github-token': '${{ secrets.PROJEN_GITHUB_TOKEN }}',
                'merge-method': 'SQUASH',
                'allowed-author': 'cu-infra-svc-git',
              },
            },
            {
              name: 'Auto approve',
              uses: 'hmarr/auto-approve-action@v2.2.1',
              if: 'steps.should-auto-merge.outputs.auto-merge',
              with: {
                'github-token': '${{ secrets.GITHUB_TOKEN }}',
              },
            },
            {
              name: 'Save processed diff logs',
              uses: 'actions/upload-artifact@v3.1.2',
              with: {
                name: 'ProcessedDiffLogs',
                path: '*.log',
                'retention-days': 3,
              },
            },
          ],
        },
      },
    };

    return defaultWorkflow;
  }
  function getStacksEnvVarForGivenEnv(envName: string) {
    return `STACKS_TO_DIFF_${envName.toUpperCase()}`;
  }

  function createStackCaptureStep(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return {
      name: 'capture stacks to diff',
      run: [
        './node_modules/.bin/cdk ls -l -j --notices=false > cdk-ls.json',
        ...createEnvVarsToCaptureStacksToDiff(envsToDiff),
      ].join('\n'),
    };
  }

  function createEnvVarsToCaptureStacksToDiff(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    const stacksToDiff = envsToDiff.map((env) => {
      const envVar = getStacksEnvVarForGivenEnv(env.name);
      if ('stackSearchString' in env) {
        return `${envVar}=$(jq -r \'[.[].id | select(contains("${env.stackSearchString}")) ] | join(" ")\' cdk-ls.json)\necho "${envVar}=$${envVar}" >> $GITHUB_ENV`;
      } else {
        return `${envVar}="${env.stacks.join(' ')}"\necho "${envVar}=$${envVar}" >> $GITHUB_ENV`;
      }
    });

    return stacksToDiff;
  }

  function createDiffSteps(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return envsToDiff.map((env) => {
      const envVar = getStacksEnvVarForGivenEnv(env.name);
      return [
        {
          name: `configure ${env.name} aws credentials`,
          uses: 'aws-actions/configure-aws-credentials@v1',
          with: {
            'role-to-assume': env.oidcRoleArn,
            'role-duration-seconds': env.roleDuration ?? 900,
            'aws-region': 'us-west-2',
          },
        },

        {
          name: `diff ${env.name}`,
          run: `set -o pipefail\n./node_modules/.bin/cdk diff $${envVar} --progress=events --staging false -e --ignore-errors --version-reporting false &> >(tee cdk-${
            env.name
          }.log)\n./node_modules/.bin/ts-node ./node_modules/@time-loop/cdk-log-parser/lib/cdkLogParser.js cdk-${
            env.name
          }.log && echo '${env.name.toUpperCase()}_HAS_NO_DIFF=true' >> $GITHUB_ENV || echo 'Diffs present!'\n`,
        },
      ];
    });
  }

  function createCdkNotifierStep(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return {
      name: 'cdk-notify',
      run: [...createDownloadCdkNotifierStep(), ...createCdkNotifierSteps(envsToDiff)].join('\n'),
    };
  }

  function createDownloadCdkNotifierStep() {
    return [
      'curl -L "https://github.com/karlderkaefer/cdk-notifier/releases/download/v2.3.2/cdk-notifier_$(uname)_amd64.gz" -o cdk-notifier.gz',
      'gunzip cdk-notifier.gz && chmod +x cdk-notifier && rm -rf cdk-notifier.gz',
    ];
  }

  function createCdkNotifierSteps(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return envsToDiff.map((env) => {
      return `./cdk-notifier --log-file ./cdk-${env.name}.log --repo $REPO_NAME --owner $GITHUB_REPOSITORY_OWNER --token \${{ secrets.GITHUB_TOKEN }} --pull-request-id \${{ github.event.pull_request.number }} -t '${env.name} Stacks - If truncated please see the action for the full log!'`;
    });
  }

  function createLabelSteps(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return envsToDiff.map((env) => {
      return {
        name: `Apply '${env.labelToApplyWhenNoDiffPresent}' label based on diff status`,
        if: `env.${env.name.toUpperCase()}_HAS_NO_DIFF == 'true'`,
        uses: 'actions/github-script@v6',
        with: {
          'github-token': '${{ secrets.GITHUB_TOKEN }}',
          script: [
            'github.rest.issues.addLabels({',
            'issue_number: context.issue.number,',
            'owner: context.repo.owner,',
            'repo: context.repo.repo,',
            `labels: ["${env.labelToApplyWhenNoDiffPresent}"]`,
            '})',
          ].join('\n'),
        },
      };
    });
  }

  function createLabelRemovalSteps(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return envsToDiff.map((env) => {
      return {
        name: `Remove '${env.labelToApplyWhenNoDiffPresent}' label based on diff status given a previous commit may have had no diff but the current one does`,
        if: `env.${env.name.toUpperCase()}_HAS_NO_DIFF != 'true'`,
        uses: 'actions/github-script@v6',
        with: {
          'github-token': '${{ secrets.GITHUB_TOKEN }}',
          script: [
            'const labels = await github.paginate(',
            'github.rest.issues.listLabelsOnIssue, {',
            'issue_number: context.issue.number,',
            'owner: context.repo.owner,',
            'repo: context.repo.repo,',
            '}',
            ')',
            `if (labels.find(label => label.name === "${env.labelToApplyWhenNoDiffPresent}")) {`,
            'github.rest.issues.removeLabel({',
            'owner: context.repo.owner,',
            'repo: context.repo.repo,',
            'issue_number: context.issue.number,',
            `name: "${env.labelToApplyWhenNoDiffPresent}"`,
            '})',
            '}',
          ].join('\n'),
        },
      };
    });
  }

  function getAutoMergeConditions(envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[]) {
    return envsToDiff.map((env) => `env.${env.name.toUpperCase()}_HAS_NO_DIFF == 'true'`).join(' && ');
  }

  interface BaseEnvToDiff {
    /**
     * Unique name for the cdk diff action
     *
     * This will be used to create the output file name, header on comments, and more
     * Example: `qa`, `staging`, `prod`
     */
    readonly name: string;

    /**
     * Name of the OIDC role name which contains neccesasry IAM policies to run the CDK diff
     *
     * Example arn: `arn:aws:iam::123123123123:role/squad-github-actions-permissions-squad-cdk-github-actions-role`
     */
    readonly oidcRoleArn: string;

    /**
     * Label that will be applied to the PR when there are no changes in the diff
     * Example: `no-qa-changes`
     */
    readonly labelToApplyWhenNoDiffPresent: string;

    /**
     * Duration in seconds for the assumed role to be valid
     * Defaut value: `900`
     */
    readonly roleDuration?: number;
  }

  export interface EnvToDiff extends BaseEnvToDiff {
    /**
     * String to search for stacks to diff
     * Example: `Qa`, 'Staging', 'Prod'
     */
    readonly stackSearchString: string;
  }

  export interface ExplicitStacksEnvToDiff extends BaseEnvToDiff {
    /**
     * Explicit stacks given instead of using stackSearchString to find stacks via cdk ls
     * Example: `['stack1', 'stack2']`
     */
    readonly stacks: string[];
  }

  export interface CDKDiffOptionsConfig extends OptionalNodeVersion {
    /**
     * Collection of environments to cdk diff
     */
    readonly envsToDiff: (EnvToDiff | ExplicitStacksEnvToDiff)[];

    /**
     * Detrmines if the OIDC role stack should be created
     */
    readonly createOidcRoleStack?: boolean;
  }

  export function getCDKDiffOptions(options?: CDKDiffOptionsConfig) {
    return options;
  }

  export function addCdkDiffWorkflowYml(
    project: clickupCdk.ClickUpCdkTypeScriptApp,
    options: CDKDiffOptionsConfig,
    override?: any,
  ): void {
    new YamlFile(project, '.github/workflows/cdk-diff.yml', {
      obj: { ...createCdkDiffWorkflow({ nodeVersion: project.workflowNodeVersion, ...options }), ...override },
    });
  }

  export function AddCdkLogParserDependency(pkg: NodePackage) {
    pkg.addDevDeps('@time-loop/cdk-log-parser');
  }

  export function addOidcRoleStack(project: clickupCdk.ClickUpCdkTypeScriptApp): void {
    new SampleFile(project, `${project.srcdir}/github-actions-oidc-permissions.ts`, {
      contents: `import { core } from '@time-loop/cdk-library';
import { aws_iam, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Namer } from 'multi-convention-namer';

export class GitHubActionsOIDCPermissions extends core.Stack {
  static asStage(scope: Construct, stageName: string, stageProps: core.StageProps): Stage {
    return new (class extends Stage {
      constructor() {
        super(scope, stageName, stageProps);
        new GitHubActionsOIDCPermissions(this, stageProps);
      }
    })();
  }
  constructor(scope: Construct, props: core.StackProps) {
    const projectName = '${project.name}';
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
          effect: aws_iam.Effect.ALLOW,
          actions: ['cloudformation:Describe*', 'cloudformation:List*', 'cloudformation:Get*'],
          resources: ['*'],
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
