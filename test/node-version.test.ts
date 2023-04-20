import { typescript, Testing } from 'projen';

import { nodeVersion } from '../src/node-version';

describe('addNodeVersionFile', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    nodeVersion.addNodeVersionFile(project);
    const synth = Testing.synth(project);
    expect(synth['.nvmrc']).toMatchSnapshot();
  });
});
