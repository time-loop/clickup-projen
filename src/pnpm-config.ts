import { javascript, typescript } from 'projen';
import { parameters } from './utils/parameters';

export module pnpmConfig {
  /**
   * Add a `.nvmrc` file to the project.
   * @param project the project for which to create / add a .nvmrc file
   */
  export function addPnpmConfig(
    project: typescript.TypeScriptProject,
    options?: { workflowNodeVersion?: string; forLibrary?: boolean },
  ): void {
    if (project.package.packageManager === javascript.NodePackageManager.PNPM) {
      // Automate part of https://app.clickup-stg.com/333/v/dc/ad-757629/ad-3577645
      project.package.addField('packageManager', `pnpm@${parameters.PROJEN_PNPM_VERSION}`);
      // Address a breaking change in pnpm 10 where all dependencies with postinstall scripts need to be explicitly listed.
      project.package.addField('pnpm', {
        onlyBuiltDependencies: ['esbuild', 'unrs-resolver'],
      });
      // necessary to allow minor/patch version updates of pnpm on dev boxes
      project.npmrc.addConfig('package-manager-strict', 'false');
      // pnpm will manage the version of the package manager (pnpm)
      project.npmrc.addConfig('manage-package-manager-versions', 'true');
      // pnpm checks this value before running commands and will use (and install if missing) the specified version
      project.npmrc.addConfig('use-node-version', options?.workflowNodeVersion ?? parameters.PROJEN_NODE_VERSION);

      if (options?.forLibrary) {
        // PNPM support for bundledDeps https://pnpm.io/npmrc#node-linker
        project.npmrc.addConfig('node-linker', 'hoisted');
      }
    }
  }
}
