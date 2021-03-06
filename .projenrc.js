const { cdk, github, javascript, YamlFile } = require('projen');

const bundledDeps = ['ts-deepmerge'];

const project = new cdk.JsiiProject({
  name: '@time-loop/clickup-projen',
  authorAddress: 'devops@clickup.com',
  authorName: 'ClickUp DevOps',
  authorOrganization: true,
  // Apache open source license, to match projen license

  defaultReleaseBranch: 'main',
  // release: true, // default
  npmRegistryUrl: 'https://npm.pkg.github.com',
  repositoryUrl: 'https://github.com/time-loop/clickup-projen.git', // default
  npmAccess: javascript.NpmAccess.PUBLIC,

  githubOptions: {
    // TODO: we should instead be using an app for auth.
    // projenCredentials: github.GithubCredentials.fromApp(writeme),
    projenCredentials: github.GithubCredentials.fromPersonalAccessToken(),
  },

  // We don't depend on any private resources.
  // Add a .npmrc before we try to Install dependencies
  // workflowBootstrapSteps: [
  //   {
  //     name: 'GitHub Packages authorization',
  //     run: [
  //       'cat > .npmrc <<EOF',
  //       '//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
  //       '@time-loop:registry=https://npm.pkg.github.com/',
  //       'EOF',
  //     ].join('\n'),
  //   },
  // ],
  // gitignore: [ '/.npmrc' ],

  bundledDeps,
  deps: [...bundledDeps, 'projen'],
  devDeps: ['projen'],
  peerDeps: ['projen'],

  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      singleQuote: true,
      trailingComma: javascript.TrailingComma.ALL,
    },
  },
  stale: true,

  jestOptions: {
    jestConfig: {
      collectCoverageFrom: ['src/**/*.ts'],
    },
  },
  codeCov: true,
  codeCovTokenSecret: 'CODECOV_TOKEN',
  // Enforce conventional commits https://www.conventionalcommits.org/
  // https://github.com/marketplace/actions/semantic-pull-request
  semanticTitleOptions: { requireScope: true },
});

new YamlFile(project, 'codecov.yml', {
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

project.synth();
