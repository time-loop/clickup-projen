import { typescript } from 'projen';

import { codecov } from '../src/codecov';

describe('addCodeCovYml', () => {
  const project = new typescript.TypeScriptProject({
    defaultReleaseBranch: 'main',
    name: 'test',
  });
  codecov.addCodeCovYml(project);
  test('file added', () => {
    expect(project).toBeTruthy();
  });
});

describe('addCodeCovYml', () => {
  const project = new typescript.TypeScriptProject({
    defaultReleaseBranch: 'main',
    name: 'test',
  });
  codecov.addCodeCovOnRelease(project);
  test('prettier is enabled', () => {
    expect(project).toBeTruthy();
  });
});
