import { awscdk, Component, javascript, JsonPatch, SampleDir, SampleReadme } from 'projen';
import * as semver from 'semver';
import merge from 'ts-deepmerge';

import { addToProjectWorkflow } from './add-to-project';
import { cdkContextJson } from './cdk-context-json';
import { cdkDiffWorkflow } from './cdk-diff-workflow';
import { clickupTs } from './clickup-ts';
import { codecov } from './codecov';
import { codecovBypassWorkflow } from './codecov-bypass-workflow';
import { datadog } from './datadog';
import { datadogServiceCatalog } from './datadog-service-catalog';
import { nodeVersion } from './node-version';
import { renovateWorkflow } from './renovate-workflow';
import { slackAlert } from './slack-alert';
import { updateProjen } from './update-projen';
import { parameters } from './utils/parameters';

export module clickupCdk {
  const minCdkVersion = '2.138.0'; // https://github.com/aws/aws-cdk/issues/29746
  const defaultCdkVersion = '2.138.0';

  export const deps = [
    ...clickupTs.deps,
    '@time-loop/cdk-library',
    '@time-loop/cdk-named-environments',
    'source-map@^0.7.4', // CLK-393642 and https://github.com/mozilla/source-map/issues/454
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

    /**
     * Codecov Bypass options
     *
     * @default undefined
     */
    readonly codecovBypassOptionsConfig?: codecovBypassWorkflow.CodecovBypassOptionsConfig;

    /**
     * Datadog Service Catalog options
     *
     * @default undefined
     */
    readonly serviceCatalogOptions?: datadogServiceCatalog.ServiceCatalogOptions;
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
      const mergedOptions = merge(
        clickupTs.defaults,
        {
          jsiiVersion: '~5.7.0', // Force JSII upgrade CLK-469895
          typescriptVersion: '~5.7.0',
        },
        options,
        {
          authorName,
          authorAddress,
          name,
          repositoryUrl,
          renovatebotOptions: renovateWorkflow.getRenovateOptions(options.renovateOptionsConfig),
          cdkDiffOptions: cdkDiffWorkflow.getCDKDiffOptions(options.cdkDiffOptionsConfig),
          codecovBypassOptions: codecovBypassWorkflow.getCodecovBypassOptions(options.codecovBypassOptionsConfig),
        },
      );
      super(mergedOptions);
      clickupTs.fixTsNodeDeps(this.package);
      codecov.addCodeCovYml(this);
      nodeVersion.addNodeVersionFile(this, { nodeVersion: mergedOptions.workflowNodeVersion });
      renovateWorkflow.addRenovateWorkflowYml(this);
      addToProjectWorkflow.addAddToProjectWorkflowYml(this);
      updateProjen.addWorkflows(this);

      // Release workflow needs to start by being auth'd to fetch packages,
      // BUT THEN NEEDS TO PUSH, so it changes auth midstream.
      // So... let's clean up after the install step.
      // Install step is currently 8th, Release is 11th.
      // Split the difference in the hopes that this keeps working despite change.
      const releaseYaml = this.tryFindObjectFile('.github/workflows/release.yml');
      releaseYaml?.patch(
        JsonPatch.add('/jobs/release_npm/steps/8', {
          name: 'Remove ~/.npmrc file for release',
          run: 'rm ~/.npmrc || true',
        }),
      );

      if (options.sendReleaseEvent === false) {
        this.datadogEvent = false;
      } else {
        datadog.addReleaseEvent(this, options.sendReleaseEventOpts);
        this.datadogEvent = true;
      }

      if (options.sendSlackWebhookOnRelease !== false) {
        slackAlert.addReleaseEvent(this, options.sendSlackWebhookOnReleaseOpts);
      }

      if (this.package.packageManager === javascript.NodePackageManager.PNPM) {
        // Automate part of https://app.clickup-stg.com/333/v/dc/ad-757629/ad-3577645
        this.package.addField('packageManager', `pnpm@${parameters.PROJEN_PNPM_VERSION}`);
        // necessary to allow minor/patch version updates of pnpm on dev boxes
        this.npmrc.addConfig('package-manager-strict', 'false');
        // pnpm will manage the version of the package manager (pnpm)
        this.npmrc.addConfig('manage-package-manager-versions', 'true');
        // pnpm checks this value before running commands and will use (and install if missing) the specified version
        this.npmrc.addConfig('use-node-version', parameters.PROJEN_NODE_VERSION);
        // PNPM support for bundledDeps https://pnpm.io/npmrc#node-linker
        this.npmrc.addConfig('node-linker', 'hoisted');
      }
    }
  }

  export interface ClickUpCdkTypeScriptAppOptions extends awscdk.AwsCdkTypeScriptAppOptions, ClickUpCdkCommonOptions {
    /**
     * Add support for cdk.context.json lookups?
     * This allows GitHub PRs to lookup missing things from your cdk.context.json
     * file and then commit a self-mutation so that your PRs don't break.
     */
    readonly cdkContextJsonOptions?: cdkContextJson.Options;
  }

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
    readonly workflowNodeVersion?: string;

    constructor(options: ClickUpCdkTypeScriptAppOptions) {
      // This cdkVersion is actually the minimum version that's compatible. This only affects devDeps.
      // This really only affects users when they try to deploy directly from their laptop.
      // When deploying from cdkPipelines, it will use whatever version the library is currently on per yarn.lock.
      let cdkVersion = undefined;
      if (semver.lt(options.cdkVersion, minCdkVersion)) {
        cdkVersion = defaultCdkVersion;
        console.warn(
          `Your cdkVersion of ${options.cdkVersion} is less than ${minCdkVersion}. We recommend using latest, which you can find at https://github.com/aws/aws-cdk/releases . Until you explicitly set something the is compliant, we are pushing to ${defaultCdkVersion}`,
        );
      }

      const mergedOptions = merge(clickupTs.defaults, defaults, options, {
        cdkVersion: cdkVersion ?? options.cdkVersion,
        sampleCode: false,
        renovatebotOptions: renovateWorkflow.getRenovateOptions(options.renovateOptionsConfig),
      });
      super(mergedOptions);
      this.workflowNodeVersion = mergedOptions.workflowNodeVersion;
      clickupTs.fixTsNodeDeps(this.package);
      new AppSampleCode(this);
      new SampleReadme(this, {
        contents: `[![codecov](https://codecov.io/gh/time-loop/WRITEME/branch/main/graph/badge.svg?token=WRITEME)](https://codecov.io/gh/time-loop/WRITEME)

        # my-new-app-cdk
        `,
      });
      codecov.addCodeCovYml(this);
      nodeVersion.addNodeVersionFile(this, { nodeVersion: mergedOptions.workflowNodeVersion });
      renovateWorkflow.addRenovateWorkflowYml(this);
      addToProjectWorkflow.addAddToProjectWorkflowYml(this);
      updateProjen.addWorkflows(this);
      if (options.cdkDiffOptionsConfig) {
        cdkDiffWorkflow.addCdkDiffWorkflowYml(this, {
          ...options.cdkDiffOptionsConfig,
          nodeVersion: options.workflowNodeVersion,
        });
        cdkDiffWorkflow.AddCdkLogParserDependency(this.package);
        if (options.cdkDiffOptionsConfig.createOidcRoleStack) {
          cdkDiffWorkflow.addOidcRoleStack(this);
        }
      }
      if (options.codecovBypassOptionsConfig) {
        codecovBypassWorkflow.addCodecovBypassWorkflowYml(this, options.codecovBypassOptionsConfig);
      }

      if (options.cdkContextJsonOptions) {
        if (options.cdkContextJsonOptions.injectionOptions) {
          cdkContextJson.injectAwsAuthIntoBuild(this, options.cdkContextJsonOptions.injectionOptions);
        }
        if (options.cdkContextJsonOptions.createOidcRoleStack) {
          cdkContextJson.addOidcRoleStack(this);
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

      if (options.serviceCatalogOptions) {
        datadogServiceCatalog.addServiceCatalogEvent(this, options.serviceCatalogOptions);
      }

      // While this is a subclass of AwsCdkTypeScriptApp,
      // it doesn't seem to be inheriting this stuff
      if (this.package.packageManager === javascript.NodePackageManager.PNPM) {
        // Automate part of https://app.clickup-stg.com/333/v/dc/ad-757629/ad-3577645
        this.package.addField('packageManager', `pnpm@${parameters.PROJEN_PNPM_VERSION}`);
        // pnpm will manage the version of the package manager (pnpm)
        this.npmrc.addConfig('manage-package-manager-versions', 'true');
        // pnpm checks this value before running commands and will use (and install if missing) the specified version
        this.npmrc.addConfig('use-node-version', parameters.PROJEN_NODE_VERSION);
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
