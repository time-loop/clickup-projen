import { typescript, Testing } from 'projen';

import { updateProjen } from '../src/update-projen';

describe('addAddToProjectWorkflowYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    updateProjen.addWorkflows(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/add-to-update-projen-project.yml']).toMatchSnapshot();
    expect(synth['.github/workflows/update-projen-main.yml']).toMatchSnapshot();
  });
});
