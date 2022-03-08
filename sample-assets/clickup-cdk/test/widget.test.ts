import { core } from '@time-loop/cdk-library';
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
