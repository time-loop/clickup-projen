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

describe('getRenovateOptions', () => {
  test('merges options', () => {
    const options = renovateWorkflow.getRenovateOptions({ defaultOverrides: { overrideConfig: { dryRun: true } } });
    // custom option we set
    expect(options.overrideConfig.dryRun).toBe(true);
    // default option that should be deep merged in
    expect(options.overrideConfig.rangeStrategy).toBe('bump');
  });

  test('auto merge off by default', () => {
    const options = renovateWorkflow.getRenovateOptions();
    expect(options.overrideConfig.packageRules[0].automerge).toBeUndefined();
    expect(options.overrideConfig.packageRules[0].addLabels[0]).toBeUndefined();
    expect(options.labels).toEqual([renovateWorkflow.DEFAULT_RENOVATE_PR_LABEL]);
  });

  test('auto merge on', () => {
    const options = renovateWorkflow.getRenovateOptions({ autoMergeNonBreakingUpdates: true });
    expect(options.overrideConfig.packageRules[0].automerge).toBe(true);
    expect(options.overrideConfig.packageRules[0].addLabels[0]).toEqual([renovateWorkflow.AUTO_APPROVE_PR_LABEL]);
    expect(options.labels).toEqual([renovateWorkflow.DEFAULT_RENOVATE_PR_LABEL]);
  });
});
