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

  test('node20', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
      workflowNodeVersion: '20.5.1',
      minNodeVersion: '20.5.1',
    });
    nodeVersion.addNodeVersionFile(project);
    const synth = Testing.synth(project);
    expect(synth['.nvmrc']).toMatchSnapshot();
  });
});
