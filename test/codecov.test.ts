import { typescript, Testing } from 'projen';

import { codecov } from '../src/codecov';

describe('addCodeCovYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codecov.addCodeCovYml(project);
    const synth = Testing.synth(project);
    expect(synth['codecov.yml']).toMatchSnapshot();
  });
  test('override', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codecov.addCodeCovYml(project, { foo: 'bar' });
    const synth = Testing.synth(project);
    expect(synth['codecov.yml']).toMatchSnapshot();
  });
});

describe('addCodeCovOnRelease', () => {
  const project = new typescript.TypeScriptProject({
    defaultReleaseBranch: 'main',
    name: 'test',
  });
  codecov.addCodeCovOnRelease(project);
  const synth = Testing.synth(project);
  test('codecov job added to workflow', () => {
    expect(synth['.github/workflows/release.yml']).toMatchSnapshot();
  });
});
