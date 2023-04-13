import { typescript, Testing } from 'projen';

import { gitHubSettings } from '../src/github-settings';

describe('addGitHubSettingsYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    gitHubSettings.addGitHubSettingsYml(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/semgrep.yml']).toMatchSnapshot();
  });
  test('override', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    gitHubSettings.addGitHubSettingsYml(project, { foo: 'bar' });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/semgrep.yml']).toMatchSnapshot();
  });
});
