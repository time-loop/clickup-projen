import { TextFile, typescript } from 'projen';
import { parameters } from './utils/parameters';

export module nodeVersion {
  /**
   * Add a `.nvmrc` file to the project.
   * @param project the project for which to create / add a .nvmrc file
   */
  export function addNodeVersionFile(project: typescript.TypeScriptProject): void {
    new TextFile(project, '.nvmrc', {
      lines: [parameters.PROJEN_NODE_VERSION],
    });
  }
}
