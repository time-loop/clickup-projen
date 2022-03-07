import { core } from '@time-loop/cdk-library';
import { aws_iam, aws_kms, RemovalPolicy } from 'aws-cdk-lib';
import * as statement from 'cdk-iam-floyd';
import { Construct } from 'constructs';
import { Namer } from 'multi-convention-namer';

export interface WidgetProps {
  readonly managedPolicyName: string;
}

export class Widget extends Construct {
  readonly policy: aws_iam.ManagedPolicy;

  constructor(scope: Construct, id: Namer, props: WidgetProps) {
    super(scope, id.pascal);

    const key = new aws_kms.Key(this, 'Key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

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

    new Widget(this, id, props);
  }
}
