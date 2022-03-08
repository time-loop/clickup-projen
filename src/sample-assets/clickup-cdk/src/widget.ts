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
  // Instead, consider using `core.Param.put` to put the ARN
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
      // Note that the `allow()` is implicit.
      new statement.Kms({ sid: 'DescriptiveName' }).to('Decrypt*').on(key.keyArn),
      // Have `cdk-iam-floyd` construct the ARN for you
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
    // ```
    // new FrozzleBop(this, id, { policy: widget.policy });
    // ```
    // placeholder to keep lint happy
    console.log(widget.policy.managedPolicyArn);
  }
}
