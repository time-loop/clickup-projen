import { Testing } from 'projen';
import { clickupCdk } from '../src';
import { getPinnedDeps } from '../src/helpers';

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
    test('datadog event sending is enabled', () => {
      expect(p.datadogEvent).toBeTruthy();
    });
    // TODO: soooo many more tests need to be written here.
  });
  describe('options', () => {
    let p: clickupCdk.ClickUpCdkTypeScriptApp;
    test('datadog event sending can be disabled', () => {
      p = new clickupCdk.ClickUpCdkTypeScriptApp({ ...requiredParams, sendReleaseEvent: false });
      expect(p.datadogEvent).toBeFalsy();
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
    test('datadog event sending is enabled', () => {
      expect(p.datadogEvent).toBeTruthy();
    });
  });
  describe('options', () => {
    const commonProps = {
      ...requiredParams,
      author: '',
      authorAddress: '',
      repositoryUrl: '',
    };
    let p: clickupCdk.ClickUpCdkConstructLibrary;
    test('datadog event sending can be disabled', () => {
      p = new clickupCdk.ClickUpCdkConstructLibrary({
        ...commonProps,
        sendReleaseEvent: false,
      });
      expect(p.datadogEvent).toBeFalsy();
    });
    describe('peerDeps', () => {
      const props: clickupCdk.ClickUpCdkConstructLibraryOptions = {
        ...commonProps,
        peerDeps: ['@time-loop/cdk-ecs-fargate@^1.0.3', 'ts-deepmerge@2.5.3'],
      };
      p = new clickupCdk.ClickUpCdkConstructLibrary(props);
      const synth = Testing.synth(p);
      const pkgJson = synth['package.json'];

      it('are set correctly', () => {
        // Need to stringify, then parse to make this accessible
        const peerDeps: Record<string, string> = JSON.parse(JSON.stringify(pkgJson.peerDependencies));
        expect(peerDeps).toBeDefined();
        const actualPeerDeps = Object.entries(peerDeps).map((kvPair) => {
          return kvPair.join('@');
        });
        props.peerDeps!.forEach((dep) => {
          expect(actualPeerDeps.includes(dep)).toBeTruthy();
        });
      });
      it('adds to devDeps correctly', () => {
        // Need to stringify, then parse to make this accessible
        const devDeps: Record<string, string> = JSON.parse(JSON.stringify(pkgJson.devDependencies));
        expect(devDeps).toBeDefined();
        const actualDevDeps = Object.entries(devDeps).map((kvPair) => {
          return kvPair.join('@');
        });
        const expectedDevDeps = getPinnedDeps(props.peerDeps!);
        expectedDevDeps.forEach((dep) => {
          expect(actualDevDeps.includes(dep)).toBeTruthy();
        });
      });
    });
  });
});
