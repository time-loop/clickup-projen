import { core } from '@time-loop/cdk-library';
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

console.log(`Deploying to ${JSON.stringify(namedEnv.name).blue} in ${JSON.stringify(namedEnv.region).blue}.`);

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
