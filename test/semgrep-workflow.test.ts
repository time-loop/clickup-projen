import { typescript, Testing } from 'projen';

import { semgrepWorkflow } from '../src/semgrep-workflow';

describe('addSemgrepWorkflowYml', () => {
  test('file added', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    semgrepWorkflow.addSemgrepWorkflowYml(project);
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/semgrep.yml']).toMatchSnapshot();
  });
  test('override', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    semgrepWorkflow.addSemgrepWorkflowYml(project, { foo: 'bar' });
    const synth = Testing.synth(project);
    expect(synth['.github/workflows/semgrep.yml']).toMatchSnapshot();
  });
});
