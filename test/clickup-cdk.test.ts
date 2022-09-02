import { Testing } from 'projen';
import { clickupCdk } from '../src';

const requiredParams = {
  name: 'test',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
};

describe('ClickUpCdkTypeScriptApp', () => {
  describe('defaults', () => {
    const p = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
    const synth = Testing.synth(p);
    ['README.md', 'package.json', 'src/main.ts', 'src/widget.ts', 'test/widget.test.ts'].forEach((file) => {
      test(file, () => {
        expect(synth[file]).toMatchSnapshot();
      });
    });
    test('prettier is enabled', () => {
      expect(p.prettier).toBeTruthy();
    });
    test('jest is enabled', () => {
      expect(p.jest).toBeTruthy();
    });

    // TODO: soooo many more tests need to be written here.
  });
  describe('feature flags', () => {
    let p: clickupCdk.ClickUpCdkTypeScriptApp;
    test('datadog event sending is disabled by default', () => {
      p = new clickupCdk.ClickUpCdkTypeScriptApp(requiredParams);
      expect(p.datadogEvent).toBeFalsy();
    });
    test('datadog event sending is enabled by FF', () => {
      p = new clickupCdk.ClickUpCdkTypeScriptApp({ ...requiredParams, sendDatadogEvent: true });
      expect(p.datadogEvent).toBeTruthy();
    });
  });
});

describe('ClickUpCdkConstructLibrary', () => {
  describe('defaults', () => {
    const p = new clickupCdk.ClickUpCdkConstructLibrary({
      ...requiredParams,
      author: '',
      authorAddress: '',
      repositoryUrl: '',
    });
    const synth = Testing.synth(p);
    ['package.json'].forEach((file) => {
      test(file, () => {
        expect(synth[file]).toMatchSnapshot();
      });
    });
  });
  describe('feature flags', () => {
    const commonProps = {
      ...requiredParams,
      author: '',
      authorAddress: '',
      repositoryUrl: '',
    };
    let p: clickupCdk.ClickUpCdkConstructLibrary;
    test('datadog event sending is disabled by default', () => {
      p = new clickupCdk.ClickUpCdkConstructLibrary(commonProps);
      expect(p.datadogEvent).toBeFalsy();
    });
    test('datadog event sending is enabled by FF', () => {
      p = new clickupCdk.ClickUpCdkConstructLibrary({
        ...commonProps,
        sendDatadogEvent: true,
      });
      expect(p.datadogEvent).toBeTruthy();
    });
  });
});
