import { javascript, typescript, Component, JsonFile } from 'projen';
import { NodePackage } from 'projen/lib/javascript';
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

    minNodeVersion: '14.18.0', // Required by eslint-import-resolver-typescript@3.3.0
    workflowNodeVersion: '14.18.0',

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
   * Options needed to configure `typedoc` for generation of documentation.
   * This configuration overrides the default settings set when using the
   * `docgen` attribute of projen's typescript.TypeScriptProjectOptions.
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
    configFileContents?: Record<string, any>;
    /**
     * The file path at which to create the Typedoc config file.
     * @default 'typedoc.json'
     */
    configFilePath?: string;
    /**
     * Whether to generate the documentation in rendered HTML as opposed to
     * the Markdown format.
     * @default false
     */
    html?: boolean;
  }

  /**
   * Adds a simple Typescript documentation generator utilizing `typedoc`.
   * Adds the necessary dependencies and automatic doc generation task
   * post-compile.
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

  export interface ClickUpTypeScriptProjectOptions extends typescript.TypeScriptProjectOptions {
    /**
     * If defined, enables automatic generation of documentation for exposed
     * resources via typedoc after compile. NOTE: `docgen` attribute MUST also be set.
     */
    docgenOptions?: TypedocDocgenOptions;
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
      if (options.docgenOptions && !options.docgen)
        throw new Error(`docgen attribute must be set to utilize docgenOptions.`);
      super(
        merge(defaults, { deps }, options, {
          docgen: options.docgenOptions ? false : options.docgen,
          name: normalizeName(options.name),
        }),
      );
      fixTsNodeDeps(this.package);
      codecov.addCodeCovYml(this);
      if (options.docgenOptions) new TypedocDocgen(this, options.docgenOptions);
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
