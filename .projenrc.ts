import { cdk, github, javascript, TextFile, YamlFile } from 'projen';
import { addToProjectWorkflow } from './src/add-to-project';
import { renovateWorkflow } from './src/renovate-workflow';
import { slackAlert } from './src/slack-alert';
import { updateProjen } from './src/update-projen';
import { parameters } from './src/utils/parameters';

const bundledDeps = ['cson-parser', 'semver', 'ts-deepmerge'];

const project = new cdk.JsiiProject({
  name: '@time-loop/clickup-projen',
  author: 'ClickUp DevOps',
  authorAddress: 'devops@clickup.com',
  authorName: 'ClickUp DevOps',
  authorOrganization: true,
  majorVersion: 1, // trigger a 1.0.0 release
  jsiiVersion: '~5.4.0', // per note, JSII since v5.0.0 are not semver'd so... stick with minor version updates.
  // Apache open source license, to match projen license

  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: '9',

  minNodeVersion: parameters.PROJEN_MIN_ENGINE_NODE_VERSION,
  workflowNodeVersion: parameters.PROJEN_NODE_VERSION,

  defaultReleaseBranch: 'main',
  // release: true, // default
  npmRegistryUrl: 'https://npm.pkg.github.com',
  repositoryUrl: 'https://github.com/time-loop/clickup-projen.git', // default
  npmAccess: javascript.NpmAccess.PUBLIC,

  githubOptions: {
    // TODO: we should instead be using an app for auth.
    // projenCredentials: github.GithubCredentials.fromApp(writeme),
    projenCredentials: github.GithubCredentials.fromPersonalAccessToken(),
    pullRequestLintOptions: {
      // Enforce conventional commits https://www.conventionalcommits.org/
      // https://github.com/marketplace/actions/semantic-pull-request
      semanticTitleOptions: { requireScope: true },
    },
  },

  gitignore: ['.idea'],

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
  deps: [...bundledDeps, 'projen', 'semver'],
  devDeps: ['projen', '@types/semver'],
  peerDeps: ['projen'],

  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      singleQuote: true,
      trailingComma: javascript.TrailingComma.ALL,
    },
  },
  projenrcTs: true,
  stale: true,

  depsUpgrade: false,
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: [renovateWorkflow.RENOVATE_GITHUB_USERNAME],
    label: renovateWorkflow.AUTO_APPROVE_PR_LABEL,
  },
  renovatebot: true,
  renovatebotOptions: renovateWorkflow.getRenovateOptions({
    autoMergeNonBreakingUpdates: true,
  }),

  jestOptions: {
    jestConfig: {
      collectCoverageFrom: ['src/**/*.ts'],
    },
  },
  codeCov: true,
  codeCovTokenSecret: 'CODECOV_TOKEN',
});

slackAlert.addReleaseEvent(project);

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

// Automate part of https://app.clickup-stg.com/333/v/dc/ad-757629/ad-3577645
project.package.addField('packageManager', 'pnpm@9.1.2');
// necessary to allow minor/patch version updates of pnpm on dev boxes
project.npmrc.addConfig('package-manager-strict', 'false');
// PNPM support for bundledDeps https://pnpm.io/npmrc#node-linker
project.npmrc.addConfig('node-linker', 'hoisted');

new TextFile(project, '.nvmrc', {
  lines: [parameters.PROJEN_NODE_VERSION],
});

renovateWorkflow.addRenovateWorkflowYml(project);
addToProjectWorkflow.addAddToProjectWorkflowYml(project);
updateProjen.addWorkflows(project);

project.synth();
