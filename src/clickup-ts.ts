import { javascript, typescript, Component, JsonFile } from 'projen';
import { NodePackage } from 'projen/lib/javascript';
import merge from 'ts-deepmerge';
import { addToProjectWorkflow } from './add-to-project';
import { codecov } from './codecov';
import { renovateWorkflow } from './renovate-workflow';
import { slackAlert } from './slack-alert';

export module clickupTs {
  // This is not included in defaults because other projects may not always want to require it.
  export const deps = ['@time-loop/clickup-projen'];

  export const devDeps = ['esbuild', 'eslint-config-prettier', 'eslint-plugin-prettier', 'jsii-release', 'prettier'];

  // We need to be picky about our typing here.
  // We don't want a default name
  // (you'd think we could deduce it from the github repo name, but that won't work with CodeBuild checkouts by default)
  // We need to also get rid of the `| undefined` to make deep merge happy.
  export const defaults: Omit<ClickUpTypeScriptProjectOptions, 'name'> & {
    authorAddress: string;
    authorName: string;
  } = {
    authorAddress: 'devops@clickup.com',
    authorName: 'ClickUp',
    authorOrganization: true,
    licensed: false,
    defaultReleaseBranch: 'main',

    release: true,
    releaseToNpm: true,
    npmRegistryUrl: 'https://npm.pkg.github.com',

    devDeps,

    depsUpgrade: true,
    depsUpgradeOptions: {
      workflow: false,
    },
    autoApproveUpgrades: true,
    autoApproveOptions: {
      allowedUsernames: [renovateWorkflow.RENOVATE_GITHUB_USERNAME],
      label: renovateWorkflow.AUTO_APPROVE_PR_LABEL,
    },
    renovatebot: true,
    workflowBootstrapSteps: [
      {
        name: 'GitHub Packages authorization',
        // Conditional because of projen breakage: https://github.com/projen/projen/pull/2311
        if: "${{ github.job != 'release_npm' }}",
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
    gitignore: ['/.npmrc', '.idea', '.yalc', 'yalc.lock'],

    minNodeVersion: '16.20.0',
    workflowNodeVersion: '16.20.0',

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

  /**
   * Optional properties for configuring the `typedoc` documentation generator.
   * This configuration provides further customization than what is offered by
   * projen's typescript.TypedocDocgen class.
   */
  export interface TypedocDocgenOptions {
    /**
     * Supports all config keys enumerated in the Typedoc Options.
     * https://typedoc.org/guides/options/
     * @default
     * {
     *   $schema: 'https://typedoc.org/schema.json',
     *   entryPoints: ['./src/index.ts'],
     *   out: project.docsDirectory,
     *   readme: 'none',
     * }
     */
    readonly configFileContents?: Record<string, any>;
    /**
     * The file path at which to create the Typedoc config file.
     * @default 'typedoc.json'
     */
    readonly configFilePath?: string;
    /**
     * Whether to generate the documentation in rendered HTML as opposed to
     * the Markdown format.
     * @default false
     */
    readonly html?: boolean;
  }

  /**
   * Adds a simple Typescript documentation generator utilizing `typedoc`.
   * Adds the necessary dependencies and automatic doc generation task during
   * post-compile phase.
   *
   * Do not use with JSII projects.
   */
  class TypedocDocgen extends Component {
    readonly configFile: JsonFile;

    constructor(project: ClickUpTypeScriptProject, props: TypedocDocgenOptions) {
      super(project);
      this.configFile = this.createConfig(project, props);
      this.createTask(project, props);
    }

    private createConfig(project: ClickUpTypeScriptProject, props: TypedocDocgenOptions): JsonFile {
      const configFileDefaults: Record<string, any> = {
        $schema: 'https://typedoc.org/schema.json',
        entryPoints: ['./src/index.ts'],
        out: project.docsDirectory,
        readme: 'none',
      };
      return new JsonFile(project, props.configFilePath ?? 'typedoc.json', {
        obj: {
          ...configFileDefaults,
          ...props.configFileContents, // Overrides
          disableSources: true, // Cannot be overriden or commit loops are encountered
        },
        marker: false, // Disables additional Projen marker since it will not function
      });
    }

    private createTask(project: ClickUpTypeScriptProject, props: TypedocDocgenOptions): void {
      // Any plugins with name `typedocplugin`, `typedoc-plugin`, or `typedoc-theme`
      // are automatically loaded when typedoc executes.
      const plugins: string[] = props.html ? [] : ['typedoc-plugin-markdown'];
      project.addDevDeps('typedoc', ...plugins);

      // Create automatic documentation generation task...
      const docgen = project.addTask('typedocDocgen', {
        description: `Generate TypeScript API reference to ${project.docsDirectory} directory`,
        exec: `typedoc`,
      });

      // ...and have it run after a successful compile
      project.postCompileTask.spawn(docgen);
    }
  }

  export interface ClickUpTypeScriptProjectOptions
    extends typescript.TypeScriptProjectOptions,
      slackAlert.SendSlackOptions {
    /**
     * Additional options pertaining to the typedoc config file.
     * NOTE: `docgen` attribute cannot be false.
     */
    readonly docgenOptions?: TypedocDocgenOptions;

    /**
     * Email address for project author
     */
    readonly authorAddress?: string;

    readonly renovateOptionsConfig?: renovateWorkflow.RenovateOptionsConfig;
  }

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
      super(
        merge(defaults, { deps }, options, {
          // Disable projen's built-in docgen class
          docgen: undefined,
          name: normalizeName(options.name),
          renovatebotOptions: renovateWorkflow.getRenovateOptions(options.renovateOptionsConfig),
        }),
      );
      fixTsNodeDeps(this.package);
      codecov.addCodeCovYml(this);
      renovateWorkflow.addRenovateWorkflowYml(this);
      addToProjectWorkflow.addAddToProjectWorkflowYml(this);
      if (options.docgen ?? true) new TypedocDocgen(this, options.docgenOptions ?? {});
      if (options.sendSlackWebhookOnRelease !== false) {
        slackAlert.addReleaseEvent(this, options.sendSlackWebhookOnReleaseOpts);
      }
    }
  }

  /**
   * Resolves resolveTypeReferenceDirective error. It can't be done in
   * clickupTs.devDeps (something in TypeScriptProject base class constructor
   * gives clickupTs.devDeps lower priority than to the deps derived from other
   * packages where ts-node is mentioned?).
   */
  export function fixTsNodeDeps(pkg: NodePackage) {
    pkg.addDevDeps('ts-node@^10');
  }
}
