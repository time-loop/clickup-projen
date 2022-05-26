import { javascript, typescript } from 'projen';
import merge from 'ts-deepmerge';
import { codecov } from './codecov';

export module clickupTs {
  // This is not included in defaults because other projects may not always want to require it.
  export const deps = ['@time-loop/clickup-projen'];

  export const devDeps = ['esbuild', 'eslint-config-prettier', 'eslint-plugin-prettier', 'jsii-release', 'prettier'];

  export const defaults = {
    authorAddress: 'devops@clickup.com',
    authorName: 'ClickUp',
    authorOrganization: true,
    licensed: false,

    release: true,
    releaseToNpm: true,
    npmRegistryUrl: 'https://npm.pkg.github.com',

    devDeps,

    depsUpgradeOptions: {
      workflowOptions: {
        schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
      },
    },

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
      {
        // Note that this only affects the behavior of the `ecr-cdk-deployment` construct
        // https://constructs.dev/packages/cdk-ecr-deployment/v/2.5.1?lang=typescript
        // used by some docker related projects.
        // But it's otherwise harmless, so... let's make this a default.
        name: 'Make cdk-ecr-deployment sane',
        run: 'export FORCE_PREBUILT_LAMBDA=1',
      },
    ],
    gitignore: ['/.npmrc'],

    minNodeVersion: '14.17.0', // Required by @typescript-eslint/eslint-plugin@5.6.0
    workflowNodeVersion: '14.17.0',

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
      jestVersion: '^27', // https://github.com/projen/projen/issues/1801  until we upgrade to projen >=v0.54.53
    },
    codeCov: true,
    codeCovTokenSecret: 'CODECOV_TOKEN',
  };

  /**
   * normalizeName - enforce GitHub required package naming conventions.
   * @param inputName
   * @returns normalized name
   */
  export function normalizeName(inputName: string): string {
    const namePrefix = `@${process.env.GITHUB_OWNER ?? 'time-loop'}/`;
    let name = inputName;
    if (!name.startsWith(namePrefix)) {
      name = namePrefix + name;
      console.log(`Adding mandatory prefix ${namePrefix} to name. New name: ${name}`);
    }
    return name;
  }

  export interface ClickUpTypeScriptProjectOptions extends typescript.TypeScriptProjectOptions {}

  /**
   * ClickUp standardized TypeScript Project
   *
   * Includes:
   * - default author information
   * - default proprietary license
   * - default release build configuration
   * - default linting and codecov configuration
   * - default minNodeVersion: '14.17.0'
   * - default devDeps (you can add your own, but the base will always be present)
   *
   * Note that for GitHub Packages to work, the package has to be scoped into the `@time-loop` project.
   * We handle that automatically.
   */
  export class ClickUpTypeScriptProject extends typescript.TypeScriptProject {
    constructor(options: ClickUpTypeScriptProjectOptions) {
      super(merge(defaults, { deps }, options, { name: normalizeName(options.name) }));
      codecov.addCodeCovYml(this);
      codecov.addCodeCovOnRelease(this);
    }
  }
}
