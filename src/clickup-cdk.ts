import * as path from 'path';
import { awscdk, Component, SampleDir, SampleReadme } from 'projen';
import merge from 'ts-deepmerge';

import { clickupTs } from './clickup-ts';
import { codecov } from './codecov';

export module clickupCdk {
  export const deps = [
    ...clickupTs.deps,
    '@time-loop/cdk-library',
    'cdk-constants',
    'cdk-iam-floyd',
    'chalk',
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
  };

  export interface ClickUpCdkConstructLibraryOptions extends awscdk.AwsCdkConstructLibraryOptions {}

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
    constructor(options: ClickUpCdkConstructLibraryOptions) {
      // JSII means I can't Omit and then re-implement the following as optional. So...
      const authorName = options.author || clickupTs.defaults.authorName;
      const authorAddress = options.authorAddress || clickupTs.defaults.authorAddress;
      const githubOwner = `${process.env.GITHUB_OWNER ?? 'time-loop'}`;
      // Theoretically we should be able to just take a default here, but for some reason this is required.
      const repositoryUrl = options.repositoryUrl || `https://github.com/${githubOwner}/${options.name}.git`;
      super(merge(clickupTs.defaults, options, { authorName, authorAddress, repositoryUrl }));
      codecov.addCodeCovYml(this);
      codecov.addCodeCovOnRelease(this);
    }
  }

  export interface ClickUpCdkTypeScriptAppOptions extends awscdk.AwsCdkTypeScriptAppOptions {}

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
    constructor(options: ClickUpCdkTypeScriptAppOptions) {
      super(merge(clickupTs.defaults, defaults, options, { sampleCode: false }));
      new SampleCode(this);
      new SampleReadme(this, {
        contents: `[![codecov](https://codecov.io/gh/time-loop/WRITEME/branch/main/graph/badge.svg?token=WRITEME)](https://codecov.io/gh/time-loop/WRITEME)

        # my-new-app-cdk
        `,
      });
      codecov.addCodeCovYml(this);
      codecov.addCodeCovOnRelease(this);
    }
  }

  class SampleCode extends Component {
    constructor(project: ClickUpCdkTypeScriptApp) {
      super(project);

      // src files
      new SampleDir(project, project.srcdir, {
        files: {
          'main.ts': `import { core } from '@time-loop/cdk-library';
import { App } from 'aws-cdk-lib';
import 'colors';
import { Namer } from 'multi-convention-namer';

import { WidgetStack } from './widget';

const app = new App();
const env = process.env.AWS_PROFILE || (process.env.CI ? 'usDev' : '');
const region = process.env.AWS_REGION || (process.env.CI ? 'us-east-1' : undefined);
if (!env) {
  console.log('You should probably set AWS_PROFILE before using this.'.yellow);
}
const namedEnvFactory = core.Environment.findByName(env);
const namedEnv = namedEnvFactory(region);

console.log(\`Deploying to \${JSON.stringify(namedEnv.name).blue} in \${JSON.stringify(namedEnv.region).blue}.\`);

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
import * as statement from 'cdk-iam-floyd';
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
    this.policy.addStatements(
      // Reference the ARN of a locally created thingy.
      // Note that the \`allow()\` is implicit.
      new statement.Kms({ sid: 'DescriptiveName' }).to('Decrypt*').on(key.keyArn),
      // Have \`cdk-iam-floyd\` construct the ARN for you
      new statement.Cloudfront({ sid: 'GrantInvalidation' }).toCreateInvalidation().onDistribution(
        // Pull the distributionId from an SSM parameter
        core.Param.get(this, 'distributionId', {
          rootId: 'SomeOtherApp',
          stackId: 'SomeOtherStack',
          constructId: 'FooBar',
        }),
      ),
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
    test('snapshot', () => {
      // This is the fastest, most superficial test you can write.
      // It's better than nothing. But kinda fragile.
      expect(template.toJSON()).toMatchSnapshot();
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
      new SampleDir(project, path.join(project.testdir, '__snapshots__'), {
        files: {
          'widget.test.ts.snap': `// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[\`Widget default snapshot 1\`] = \`
Object {
  "Parameters": Object {
    "BootstrapVersion": Object {
      "Default": "/cdk-bootstrap/hnb659fds/version",
      "Description": "Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]",
      "Type": "AWS::SSM::Parameter::Value<String>",
    },
    "SsmParameterValueSomeOtherAppSomeOtherStackFooBardistributionIdC96584B6F00A464EAD1953AFF4B05118Parameter": Object {
      "Default": "/SomeOtherApp/SomeOtherStack/FooBar/distributionId",
      "Type": "AWS::SSM::Parameter::Value<String>",
    },
  },
  "Resources": Object {
    "TestKey4BC8CF8E": Object {
      "DeletionPolicy": "Delete",
      "Properties": Object {
        "KeyPolicy": Object {
          "Statement": Array [
            Object {
              "Action": "kms:*",
              "Effect": "Allow",
              "Principal": Object {
                "AWS": Object {
                  "Fn::Join": Array [
                    "",
                    Array [
                      "arn:",
                      Object {
                        "Ref": "AWS::Partition",
                      },
                      ":iam::469006742758:root",
                    ],
                  ],
                },
              },
              "Resource": "*",
            },
          ],
          "Version": "2012-10-17",
        },
        "Tags": Array [
          Object {
            "Key": "Business Unit",
            "Value": "product",
          },
          Object {
            "Key": "Confidentiality",
            "Value": "public",
          },
          Object {
            "Key": "DATADOG",
            "Value": "true",
          },
          Object {
            "Key": "Environment",
            "Value": "production",
          },
          Object {
            "Key": "Role",
            "Value": "app",
          },
          Object {
            "Key": "Service",
            "Value": "Test",
          },
        ],
      },
      "Type": "AWS::KMS::Key",
      "UpdateReplacePolicy": "Delete",
    },
    "TestKeyParameterThisAppNameTestKeyKeyArn13E268B9": Object {
      "Properties": Object {
        "Name": "/ThisAppName/Test/Key/keyArn",
        "Tags": Object {
          "Business Unit": "product",
          "Confidentiality": "public",
          "DATADOG": "true",
          "Environment": "production",
          "Role": "app",
          "Service": "Test",
        },
        "Type": "String",
        "Value": Object {
          "Fn::GetAtt": Array [
            "TestKey4BC8CF8E",
            "Arn",
          ],
        },
      },
      "Type": "AWS::SSM::Parameter",
    },
    "TestPolicyAC2892FA": Object {
      "Properties": Object {
        "Description": "",
        "Path": "/",
        "PolicyDocument": Object {
          "Statement": Array [
            Object {
              "Action": "kms:Decrypt*",
              "Effect": "Allow",
              "Resource": Object {
                "Fn::GetAtt": Array [
                  "TestKey4BC8CF8E",
                  "Arn",
                ],
              },
              "Sid": "DescriptiveName",
            },
            Object {
              "Action": "cloudfront:CreateInvalidation",
              "Effect": "Allow",
              "Resource": Object {
                "Fn::Join": Array [
                  "",
                  Array [
                    "arn:aws:cloudfront::*:distribution/",
                    Object {
                      "Ref": "SsmParameterValueSomeOtherAppSomeOtherStackFooBardistributionIdC96584B6F00A464EAD1953AFF4B05118Parameter",
                    },
                  ],
                ],
              },
              "Sid": "GrantInvalidation",
            },
          ],
          "Version": "2012-10-17",
        },
      },
      "Type": "AWS::IAM::ManagedPolicy",
    },
  },
  "Rules": Object {
    "CheckBootstrapVersion": Object {
      "Assertions": Array [
        Object {
          "Assert": Object {
            "Fn::Not": Array [
              Object {
                "Fn::Contains": Array [
                  Array [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                  ],
                  Object {
                    "Ref": "BootstrapVersion",
                  },
                ],
              },
            ],
          },
          "AssertDescription": "CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI.",
        },
      ],
    },
  },
}
\`;
`,
        },
      });
    }
  }
}
