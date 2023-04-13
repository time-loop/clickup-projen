import { typescript, YamlFile } from 'projen';

export module gitHubSettings {
  export const REPOSITORY_TOPICS = 'projen-managed';

  const defaultGitHubSettings = {
    repository: {
      topics: REPOSITORY_TOPICS,
    },
  };

  export function addGitHubSettingsYml(project: typescript.TypeScriptProject, override?: any): void {
    new YamlFile(project, '.github/settings.yml', { obj: { ...defaultGitHubSettings, ...override } });
  }
}
