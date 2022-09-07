import path from 'path';
import { typescript, Testing } from 'projen';
import { datadog } from '../src/datadog';

// Would be cool to find a way to not use snapshots here, without getting crazy
describe('addReleaseEvent', () => {
  test('adds job to release workflow', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    datadog.addReleaseEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('performs no-op when release option is false', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
      release: false,
    });
    datadog.addReleaseEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('adds additional tags when passed', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    datadog.addReleaseEvent(project, { event_tags: { TestKey: 'TestVal', TestKey2: 'TestVal2' } });
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('honors overrides', () => {
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'test',
    });
    const opts: datadog.ReleaseEventOptions = {
      event_priority: 'low',
      event_title: 'Test title',
      event_text: 'Test event text',
      datadog_api_key: 'TEST_API_KEY',
      datadog_us: false,
      event_tags: {
        TestTag1: 'TestTagVal1',
        TestTag2: 'TestTagVal2',
      },
    };
    datadog.addReleaseEvent(project, opts);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
});
