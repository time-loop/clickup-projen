import { TextFile, typescript } from 'projen';
import { OptionalNodeVersion } from './optional-node-version';
import { parameters } from './utils/parameters';

export module nodeVersion {
  /**
   * Add a `.nvmrc` file to the project.
   * @param project the project for which to create / add a .nvmrc file
   */
  export function addNodeVersionFile(project: typescript.TypeScriptProject, options?: OptionalNodeVersion): void {
    new TextFile(project, '.nvmrc', {
      lines: [options?.nodeVersion ?? parameters.PROJEN_NODE_VERSION],
    });
  }
}
