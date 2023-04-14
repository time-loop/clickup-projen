import { TextFile, typescript } from 'projen';
import { parameters } from './utils/parameters';

export module nodeVersion {
  /**
   * Add a `.node-version` file to the project.
   * @param project the project for which to create / add a .node-version file
   */
  export function addNodeVersionFile(project: typescript.TypeScriptProject): void {
    new TextFile(project, '.node-version', {
      lines: [parameters.PROJEN_NODE_VERSION],
    });
  }
}
