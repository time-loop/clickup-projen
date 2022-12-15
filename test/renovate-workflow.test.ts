import { typescript, Testing } from 'projen';

import { renovateWorkflow } from '../src/renovate-workflow';

describe('addRenovateWorkflowYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    renovateWorkflow.addRenovateWorkflowYml(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/renovate.yml']).toMatchSnapshot();
  });
  test('override', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    renovateWorkflow.addRenovateWorkflowYml(project, { foo: 'bar' });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/renovate.yml']).toMatchSnapshot();
  });
});
