import path from 'path';
import { typescript, Testing } from 'projen';
import { slackAlert } from '../src/slack-alert';

// Would be cool to find a way to not use snapshots here, without getting crazy
describe('addReleaseEvent', () => {
  const commonProjectOpts: typescript.TypeScriptProjectOptions = {
    defaultReleaseBranch: 'main',
    name: 'test-cdk',
  };
  test('adds job to release workflow', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    slackAlert.addReleaseEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('performs no-op when release option is false', () => {
    const project = new typescript.TypeScriptProject({
      ...commonProjectOpts,
      release: false,
    });
    slackAlert.addReleaseEvent(project);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
  test('honors overrides', () => {
    const project = new typescript.TypeScriptProject(commonProjectOpts);
    const opts: slackAlert.ReleaseEventOptions = {
      messageTitle: 'title',
      messageBody: 'body',
    };
    slackAlert.addReleaseEvent(project, opts);
    const synth = Testing.synth(project);
    expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
  });
});
