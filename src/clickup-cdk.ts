import { awscdk } from 'projen';

import { clickupTs } from './clickup-ts';
import { codecov } from './codecov';

export module clickupCdk {
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
      const deps = [
        ...clickupTs.baseDeps,
        '@time-loop/cdk-library',
        'cdk-constants',
        'cdk-iam-floyd',
        'colors',
        'multi-convention-namer',
      ].concat(...(options.deps ?? []));
      const devDeps = clickupTs.baseDevDeps.concat(...(options.devDeps ?? []));
      const gitignore = ['/.npmrc'].concat(...(options.gitignore ?? []));

      super({
        ...clickupTs.defaults,
        ...options,
        deps,
        devDeps,
        gitignore,
      });
      codecov.addCodeCovYml(this);
      codecov.addCodeCovOnRelease(this);
    }
  }
}
