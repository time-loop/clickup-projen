import * as fs from 'fs';
import * as path from 'path';
import { awscdk, Component, SampleDir, SampleReadme } from 'projen';
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
      new SampleCode(this);
      new SampleReadme(this, {
        contents: fs.readFileSync(path.join(__dirname, '..', 'sample-assets', 'clickup-cdk', 'README.md')).toString(),
      });
      codecov.addCodeCovYml(this);
      codecov.addCodeCovOnRelease(this);
    }
  }

  class SampleCode extends Component {
    constructor(project: ClickUpCdkTypeScriptApp) {
      super(project);
      const assetDir = path.join(__dirname, '..', 'sample-assets', 'clickup-cdk');

      // src files
      new SampleDir(project, project.srcdir, {
        files: {
          'main.ts': fs.readFileSync(path.join(assetDir, 'src', 'main.ts')).toString(),
          'widget.ts': fs.readFileSync(path.join(assetDir, 'src', 'widget.ts')).toString(),
        },
      });

      // test files
      new SampleDir(project, project.testdir, {
        files: {
          'widget.test.ts': fs.readFileSync(path.join(assetDir, 'test', 'widget.test.ts')).toString(),
        },
      });
      new SampleDir(project, path.join(project.testdir, '__snapshots__'), {
        files: {
          'widget.test.ts.snap': fs
            .readFileSync(path.join(assetDir, 'test', '__snapshots__', 'widget.test.ts.snap'))
            .toString(),
        },
      });
    }
  }
}
