import path from 'path';
import { typescript, Testing } from 'projen';
import { datadog } from '../src/datadog';

// Would be cool to find a way to not use snapshots here, without getting crazy
describe('addReleaseEvent', () => {
  const commonProjectOpts: typescript.TypeScriptProjectOptions = {
    defaultReleaseBranch: 'main',
    name: 'test-cdk',
  };
  test('adds job to release workflow', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    datadog.addReleaseEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('performs no-op when release option is false', () => {
    const project = new typescript.TypeScriptProject({
      ...commonProjectOpts,
      release: false,
    });
    datadog.addReleaseEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('adds additional tags when passed', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    datadog.addReleaseEvent(project, { eventTags: { TestKey: 'TestVal', TestKey2: 'TestVal2' } });
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('honors overrides', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    const opts: datadog.ReleaseEventOptions = {
      eventPriority: 'low',
      eventTitle: 'Test title',
      eventText: 'Test event text',
      datadogApiKey: 'TEST_API_KEY',
      datadogUs: false,
      eventTags: {
        TestTag1: 'TestTagVal1',
        TestTag2: 'TestTagVal2',
      },
    };
    datadog.addReleaseEvent(project, opts);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
});
