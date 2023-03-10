import { typescript, Testing } from 'projen';

import { addToProjectWorkflow } from '../src/add-to-project';

describe('addAddToProjectWorkflowYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    addToProjectWorkflow.addAddToProjectWorkflowYml(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/add-to-project.yml']).toMatchSnapshot();
  });
  test('override', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    addToProjectWorkflow.addAddToProjectWorkflowYml(project, { foo: 'bar' });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/add-to-project.yml']).toMatchSnapshot();
  });
});
