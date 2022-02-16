import { awscdk, javascript, YamlFile } from 'projen';
import { JobPermission } from 'projen/lib/github/workflows-model';

export module clickupCdk {
  export interface ClickUpCdkTypeScriptAppOptions
    extends Omit<Omit<awscdk.AwsCdkTypeScriptAppOptions, 'cdkVersion'>, 'defaultReleaseBranch'> {
    /**
     * Lowest compatible aws-cdk-lib version.
     * @default '2.0.0'
     */
    readonly cdkVersion?: string;
    /**
     * It has been years since BLM. You really shouldn't need to be over-riding this.
     * @default 'main'
     */
    readonly defaultReleaseBranch?: string;
  }

  /**
   * ClickUp standardized CDK TypeScript App
   *
   * Includes:
   * - default author information
   * - default proprietary license
   * - default release build configuration
   * - default linting and codecov configuration
   * - default cdkVersion: '2.0.0'
   * - default minNodeVersion: '14.15.0'
   * - default defaultReleaseBranch: 'main'
   * - default deps and devDeps (you can add your own, but the base will always be present)
   */
  export class ClickUpCdkTypeScriptApp extends awscdk.AwsCdkTypeScriptApp {
    constructor(options: ClickUpCdkTypeScriptAppOptions) {
      const deps = ['@time-loop/cdk-library', 'colors', 'multi-convention-namer'].concat(...(options.deps ?? []));
      const devDeps = [
        'esbuild',
        'eslint-config-prettier',
        'eslint-plugin-prettier',
        'jsii-release',
        'prettier',
      ].concat(...(options.devDeps ?? []));
      const gitignore = ['/.npmrc'].concat(...(options.gitignore ?? []));

      super({
        authorEmail: 'devops@clickup.com',
        authorName: 'ClickUp DevOps',
        authorOrganization: true,
        licensed: false,

        defaultReleaseBranch: 'main',
        release: true,
        npmRegistryUrl: 'https://npm.pkg.github.com',

        workflowBootstrapSteps: [
          {
            name: 'GitHub Packages authorization',
            run: [
              'cat > .npmrc <<EOF',
              '//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
              '@time-loop:registry=https://npm.pkg.github.com/',
              'EOF',
            ].join('\n'),
          },
        ],

        cdkVersion: '2.0.0',
        minNodeVersion: '14.15.0',

        prettier: true,
        prettierOptions: {
          settings: {
            printWidth: 120,
            singleQuote: true,
            trailingComma: javascript.TrailingComma.ALL,
          },
        },

        jestOptions: {
          jestConfig: {
            collectCoverageFrom: ['src/**/*.ts'],
          },
        },
        codeCov: true,
        codeCovTokenSecret: 'CODECOV_TOKEN',
        // Enforce conventional commits https://www.conventionalcommits.org/
        // https://github.com/marketplace/actions/semantic-pull-request
        // semanticTitleOptions: { requireScope: true },

        ...options,

        deps,
        devDeps,
        gitignore,
      });

      new YamlFile(this, 'codecov.yml', {
        obj: {
          coverage: {
            precision: 2,
            round: 'down',
            status: {
              project: {
                // Controls for the entire project
                default: {
                  target: 'auto',
                  threshold: '10%', // Allow total coverage to drop by this much while still succeeding.
                  paths: ['src'],
                  if_ci_failed: 'error',
                  only_pulls: true,
                },
              },
              // Controls for just the code changed by the PR
              patch: {
                default: {
                  base: 'auto',
                  target: 'auto',
                  threshold: '10%', // Code in src that is changed by PR must have at least this much coverage.
                  paths: ['src'],
                  if_ci_failed: 'error',
                  only_pulls: true,
                },
              },
            },
          },
          parsers: {
            gcov: {
              branch_detection: {
                conditional: 'yes',
                loop: 'yes',
                method: 'no',
                macro: 'no',
              },
            },
          },
          comment: {
            layout: 'reach,diff,flags,files,footer',
            behavior: 'default',
            require_changes: 'no',
          },
        },
      });

      this.release!.addJobs({
        codecov: {
          name: 'Publish CodeCov',
          needs: [],
          permissions: {
            contents: JobPermission.READ,
          },
          runsOn: ['ubuntu-latest'],
          steps: [
            {
              name: 'Checkout',
              uses: 'actions/checkout@v2',
            },
            {
              name: 'GitHub Packages authorization',
              run: [
                'cat > .npmrc <<EOF',
                '//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
                '@time-loop:registry=https://npm.pkg.github.com/',
                'EOF',
              ].join('\n'),
            },
            {
              name: 'Install dependencies',
              run: 'yarn install --check-files --frozen-lockfile',
            },
            {
              name: 'test',
              run: 'npx projen test',
            },
            {
              name: 'Upload coverage to Codecov',
              uses: 'codecov/codecov-action@v1',
              with: {
                token: '${{ secrets.CODECOV_TOKEN }}',
                directory: 'coverage',
              },
            },
          ],
        },
      });
    }
  }
}
