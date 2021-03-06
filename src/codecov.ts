import { typescript, YamlFile } from 'projen';

export module codecov {
  export const defaultCodecov = {
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
            threshold: '10%',
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
  };

  /**
   * Add a `codecov.yml` file to the project.
   * @param project the project for which to create / add a codecov.yml file
   * @param override changes to apply to the defaultCodecov. WARNING, this is a simple inline'd override, no deep merges.
   */
  export function addCodeCovYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, 'codecov.yml', { obj: { ...defaultCodecov, ...override } });
  }
}
