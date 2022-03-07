import { awscdk } from 'projen';
import merge from 'ts-deepmerge';

import { clickupTs } from './clickup-ts';
import { codecov } from './codecov';

export module clickupCdk {
  export interface ClickUpCdkTypeScriptAppOptions extends awscdk.AwsCdkTypeScriptAppOptions {}

  export const deps = ['@time-loop/cdk-library', 'cdk-constants', 'cdk-iam-floyd', 'colors', 'multi-convention-namer'];

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
      super(merge(clickupTs.defaults, { deps, sampleCode: false }, options));
      codecov.addCodeCovYml(this);
      codecov.addCodeCovOnRelease(this);
      // Add sample-code using SampleDir component
    }
  }
}
