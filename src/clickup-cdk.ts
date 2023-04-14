import { awscdk, Component, SampleDir, SampleReadme } from 'projen';
import merge from 'ts-deepmerge';

import { addToProjectWorkflow } from './add-to-project';
import { cdkDiffWorkflow } from './cdk-diff-workflow';
import { clickupTs } from './clickup-ts';
import { codecov } from './codecov';
import { datadog } from './datadog';
import { nodeVersion } from './node-version';
import { renovateWorkflow } from './renovate-workflow';
import { slackAlert } from './slack-alert';

export module clickupCdk {
  export const deps = [
    ...clickupTs.deps,
    '@time-loop/cdk-library',
    '@time-loop/cdk-named-environments',
    'cdk-constants',
    'multi-convention-namer',
  ];
  export const defaults = {
    deps,
    jestOptions: {
      jestConfig: {
        coveragePathIgnorePatterns: ['/node_modules/', '/src/main.ts'],
      },
    },
    releaseToNpm: false,
    pullRequestTemplateContents: [
      '# Summary',
      'Doing ABC actions to XYZ because IDK',
      '',
      '## Testing & Documentation',
      '- [ ] A unit test was added to cover the changed functionality. If not, explain.',
      '- [ ] Appropriate doc-strings were added to interfaces, objects and methods.',
      '',
      '## This PR updates the following environments',
      '- [ ] Dev',
      '- [ ] QA',
      '- [ ] Staging',
      '- [ ] Prod',
      '',
      '## Validation',
      'The following actions will be taken to validate functionality between stages:',
    ],
  };

  /**
   * Intentionally unexposed, so long as these features are hidden behind FF.
   * I.e., you have to dig to find these potentially buggy features.
   */
  interface ClickUpCdkFeatureFlags {}

  export interface ClickUpCdkCommonOptions extends ClickUpCdkFeatureFlags, slackAlert.SendSlackOptions {
    /**
     * Feature flag for datadog event sending on release.
     *
     * @default true
     */
    readonly sendReleaseEvent?: boolean;
    /**
     * Datadog event options to use on release. Only valid when
     * `sendReleaseEvent` is true.
     *
     * @default undefined
     */
    readonly sendReleaseEventOpts?: datadog.ReleaseEventOptions;

    /**
     * Renovate options
     *
     * @default undefined
     */
    readonly renovateOptionsConfig?: renovateWorkflow.RenovateOptionsConfig;

    /**
     * Cdk diff options
     *
     * @default undefined
     */
    readonly cdkDiffOptionsConfig?: cdkDiffWorkflow.CDKDiffOptionsConfig;
  }

  export interface ClickUpCdkConstructLibraryOptions
    extends awscdk.AwsCdkConstructLibraryOptions,
      ClickUpCdkCommonOptions {}

  /**
   * ClickUp standardized CDK Construct Library.
   *
   * Note: disgusting hack to achieve "defaults" in the constructor
   * leverages "empty string is falsy" behavior of TS.
   * I am not proud of this.
   * It's better than cloning the interface since projen revs pretty fast.
   * Marginally.
   */
  export class ClickUpCdkConstructLibrary extends awscdk.AwsCdkConstructLibrary {
    readonly datadogEvent: boolean;
    constructor(options: ClickUpCdkConstructLibraryOptions) {
      const name = clickupTs.normalizeName(options.name);
      // JSII means I can't Omit and then re-implement the following as optional. So...
      const authorName = options.author || clickupTs.defaults.authorName;
      const authorAddress = options.authorAddress || clickupTs.defaults.authorAddress;
      // Theoretically we should be able to just take a default here, but for some reason this is required.
      const repositoryUrl = options.repositoryUrl || `https://github.com/${name.substring(1)}.git`;
      super(
        merge(clickupTs.defaults, options, {
          authorName,
          authorAddress,
          name,
          repositoryUrl,
          renovatebotOptions: renovateWorkflow.getRenovateOptions(options.renovateOptionsConfig),
          cdkDiffOptions: cdkDiffWorkflow.getCDKDiffOptions(options.cdkDiffOptionsConfig),
        }),
      );
      clickupTs.fixTsNodeDeps(this.package);
      codecov.addCodeCovYml(this);
      nodeVersion.addNodeVersionFile(this);
      renovateWorkflow.addRenovateWorkflowYml(this);
      addToProjectWorkflow.addAddToProjectWorkflowYml(this);

      if (options.sendReleaseEvent === false) {
        this.datadogEvent = false;
      } else {
        datadog.addReleaseEvent(this, options.sendReleaseEventOpts);
        this.datadogEvent = true;
      }

      if (options.sendSlackWebhookOnRelease !== false) {
        slackAlert.addReleaseEvent(this, options.sendSlackWebhookOnReleaseOpts);
      }
    }
  }

  export interface ClickUpCdkTypeScriptAppOptions extends awscdk.AwsCdkTypeScriptAppOptions, ClickUpCdkCommonOptions {}

  /**
   * ClickUp standardized CDK TypeScript App
   *
   * Includes:
   * - default author information
   * - default proprietary license
   * - default release build configuration
   * - default linting and codecov configuration
   * - default minNodeVersion: '14.17.0'
   * - default deps and devDeps (you can add your own, but the base will always be present)
   */
  export class ClickUpCdkTypeScriptApp extends awscdk.AwsCdkTypeScriptApp {
    readonly datadogEvent: boolean;
    constructor(options: ClickUpCdkTypeScriptAppOptions) {
      super(
        merge(clickupTs.defaults, defaults, options, {
          sampleCode: false,
          renovatebotOptions: renovateWorkflow.getRenovateOptions(options.renovateOptionsConfig),
        }),
      );
      clickupTs.fixTsNodeDeps(this.package);
      new AppSampleCode(this);
      new SampleReadme(this, {
        contents: `[![codecov](https://codecov.io/gh/time-loop/WRITEME/branch/main/graph/badge.svg?token=WRITEME)](https://codecov.io/gh/time-loop/WRITEME)

        # my-new-app-cdk
        `,
      });
      codecov.addCodeCovYml(this);
      nodeVersion.addNodeVersionFile(this);
      renovateWorkflow.addRenovateWorkflowYml(this);
      addToProjectWorkflow.addAddToProjectWorkflowYml(this);
      if (options.cdkDiffOptionsConfig) {
        cdkDiffWorkflow.addCdkDiffWorkflowYml(this, options.cdkDiffOptionsConfig);
        cdkDiffWorkflow.AddCdkLogParserDependency(this.package);
        if (options.cdkDiffOptionsConfig.createOidcRoleStack) {
          cdkDiffWorkflow.addOidcRoleStack(this);
        }
      }

      if (options.sendReleaseEvent === false) {
        this.datadogEvent = false;
      } else {
        datadog.addReleaseEvent(this, options.sendReleaseEventOpts);
        this.datadogEvent = true;
      }

      if (options.sendSlackWebhookOnRelease !== false) {
        slackAlert.addReleaseEvent(this, options.sendSlackWebhookOnReleaseOpts);
      }
    }
  }

  class AppSampleCode extends Component {
    constructor(project: ClickUpCdkTypeScriptApp) {
      super(project);

      // src files
      new SampleDir(project, project.srcdir, {
        files: {
          'main.ts': `import { core } from '@time-loop/cdk-library';
import { App } from 'aws-cdk-lib';
import { Namer } from 'multi-convention-namer';

import { WidgetStack } from './widget';

const app = new App();
const env = process.env.AWS_PROFILE || (process.env.CI ? 'usDev' : '');
const region = process.env.AWS_REGION || (process.env.CI ? 'us-east-1' : undefined);
if (!env) {
  console.log('You should probably set AWS_PROFILE before using this.');
}
const namedEnvFactory = core.Environment.findByName(env);
const namedEnv = namedEnvFactory(region);

console.log(\`Deploying to \${JSON.stringify(namedEnv.name)} in \${JSON.stringify(namedEnv.region)}.\`);

const commonProps = {
  businessUnit: core.BusinessUnit.PRODUCT,
  clickUpEnvironment: core.ClickUpEnvironment.PRODUCTION,
  clickUpRole: core.ClickUpRole.APP,
  confidentiality: core.Confidentiality.PUBLIC,
  namedEnv,
};
new WidgetStack(app, new Namer(['my', 'cool', 'widget']), {
  ...commonProps,
  managedPolicyName: 'yarf',
});

app.synth();
`,
          'widget.ts': `
import { core } from '@time-loop/cdk-library';
import { aws_iam, aws_kms, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Namer } from 'multi-convention-namer';

export interface WidgetProps {
  /**
   * The name to assign the widget policy.
   * @default - have CDK generate a unique name
   */
  readonly managedPolicyName?: string;
}

/**
 * Useful comment describing the Widget construct.
 */
export class Widget extends Construct {
  // Expose the policy for use by another Construct in this Stack.
  // WARNING: cdk absolutely will let you pass objects between stacks.
  // This will generate CfnOutputs that will in turn create tight coupling between stacks.
  // This is almost never a Good Idea.
  // Instead, consider using \`core.Param.put\` to put the ARN
  // and then use myThingy.fromThingyArn() to instantiate a Interface object.
  readonly policy: aws_iam.ManagedPolicy;

  constructor(scope: Construct, id: Namer, props: WidgetProps) {
    super(scope, id.pascal);

    const key = new aws_kms.Key(this, 'Key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    // Save the key ARN using SSM, for use by another Stack
    core.Param.put(key, 'keyArn', { rootId: 'ThisAppName' });

    this.policy = new aws_iam.ManagedPolicy(this, 'Policy', {
      managedPolicyName: props.managedPolicyName,
    });

    // Pull the distributionId from an SSM parameter
    const distributionId = core.Param.get(this, 'distributionId', {
      rootId: 'SomeOtherApp',
      stackId: 'SomeOtherStack',
      constructId: 'FooBar',
    });

    // Note that the \`allow()\` is implicit for PolicyStatements
    this.policy.addStatements(
      // Reference the ARN of a locally created thing.
      new aws_iam.PolicyStatement({ sid: 'DescriptiveName', actions: ['kms:Decrypt*'], resources: [key.keyArn] }),
      // Reference the distributionId from an SSM parameter
      new aws_iam.PolicyStatement({
        sid: 'GrantInvalidation',
        actions: ['cloudfront:CreateInvalidation'],
        resources: [\`arn:aws:cloudfront::\${distributionId}:*\`],
      }),
    );
  }
}

export interface WidgetStackProps extends core.StackProps, WidgetProps {}

export class WidgetStack extends core.Stack {
  constructor(scope: Construct, id: Namer, props: WidgetStackProps) {
    super(scope, id, props);

    const widget = new Widget(this, id, props);

    // Example of passing the widget.policy to another construct in the same stack.
    // \`\`\`
    // new FrozzleBop(this, id, { policy: widget.policy });
    // \`\`\`
    // placeholder to keep lint happy
    console.log(widget.policy.managedPolicyArn);
  }
}
`,
        },
      });

      // test files
      new SampleDir(project, project.testdir, {
        files: {
          'widget.test.ts': `import { core } from '@time-loop/cdk-library';
import { App, assertions } from 'aws-cdk-lib';
import { Namer } from 'multi-convention-namer';
import { WidgetStack } from '../src/widget';

// Minimum props required by @time-loop/cdk-library/core.StackProps
const commonProps = {
  businessUnit: core.BusinessUnit.PRODUCT,
  clickUpEnvironment: core.ClickUpEnvironment.PRODUCTION,
  clickUpRole: core.ClickUpRole.APP,
  confidentiality: core.Confidentiality.PUBLIC,
  namedEnv: core.Environment.usDev('us-west-2'),
};

describe('Widget', () => {
  describe('default', () => {
    // These are resources shared by all the tests in this context.
    const app = new App();
    const stack = new WidgetStack(app, new Namer(['test']), commonProps);
    const template = assertions.Template.fromStack(stack);

    // Tests are super thin, consisting of just an assertion.
    test('creates resources', () => {
      ['AWS::IAM::ManagedPolicy', 'AWS::KMS::Key'].forEach((resource) => template.resourceCountIs(resource, 1));
    });

    // Demonstrate super-cool matcher stuff
    test('policy should reference key', () => {
      template.hasResourceProperties('AWS::IAM::ManagedPolicy', {
        PolicyDocument: {
          // The statement array must contain the following array.
          Statement: assertions.Match.arrayWith([
            assertions.Match.objectLike({
              // The array must contain an object with at least the following key / value.
              Resource: {
                'Fn::GetAtt': [
                  assertions.Match.anyValue(), // TODO: figure out how to actually reference the generated Kms key
                  'Arn',
                ],
              },
            }),
          ]),
        },
      });
    });
  });

  describe('options', () => {
    // Here we aren't sharing setup code...
    test('managedPolicyName', () => {
      // ...because each test is exercising a specific part of the functionality.
      // Which means that setups are slightly different and we can't re-use things.
      const app = new App();
      const stack = new WidgetStack(app, new Namer(['test']), {
        ...commonProps,
        managedPolicyName: 'fakeName',
      });
      const template = assertions.Template.fromStack(stack);

      template.hasResourceProperties('AWS::IAM::ManagedPolicy', {
        ManagedPolicyName: 'fakeName',
      });
    });
  });
});
`,
        },
      });
    }
  }
}
