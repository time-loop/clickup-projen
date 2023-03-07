import { typescript, Testing } from 'projen';

import { codeqlWorkflow } from '../src/codeql-workflow';

describe('addCodeqlWorkflowYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codeqlWorkflow.addCodeqlWorkflowYml(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/codeql-analysis.yml']).toMatchSnapshot();
  });
  test('override', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    codeqlWorkflow.addCodeqlWorkflowYml(project, { foo: 'bar' });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/codeql-analysis.yml']).toMatchSnapshot();
  });
});
