import path from 'path';
import { Testing, javascript } from 'projen';
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
    [
      'README.md',
      'package.json',
      'src/main.ts',
      'src/widget.ts',
      'test/widget.test.ts',
      '.github/workflows/release.yml',
    ].forEach((file) => {
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

    test('pnpm throws', () => {
      expect(() => {
        new clickupCdk.ClickUpCdkTypeScriptApp({
          ...requiredParams,
          packageManager: javascript.NodePackageManager.PNPM,
        });
      }).toThrowError(/pnpm not supported by cdkPipelines/);
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
    test('release_npm exists', () => {
      p = new clickupCdk.ClickUpCdkConstructLibrary({ ...commonProps, releaseToNpm: true });
      const synth = Testing.synth(p);
      const releaseFile = synth['.github/workflows/release.yml'];
      expect(releaseFile).toMatchSnapshot();
    });
  });
});

describe('cdk-diff additions - ClickUpCdkTypeScriptApp', () => {
  const p = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
    cdkDiffOptionsConfig: {
      envsToDiff: [
        {
          name: 'qa',
          oidcRoleArn: 'arn:aws:iam::123456789012:role/squad-github-actions-oidc-role-name-qa',
          labelToApplyWhenNoDiffPresent: 'qa-no-changes',
          stackSearchString: 'Qa',
        },
      ],
      createOidcRoleStack: true,
    },
  });
  const synth = Testing.synth(p);
  ['package.json', 'src/github-actions-oidc-permissions.ts'].forEach((file) => {
    test(file, () => {
      expect(synth[file]).toMatchSnapshot();
    });
  });
});

test('sending service catalog options', () => {
  const project = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
    serviceCatalogOptions: {
      serviceInfo: [
        {
          serviceName: 'test-service',
          description: 'test description test-service 1',
          application: 'clickup',
          tier: 'critical',
          lifecycle: 'unit-test',
          team: 'testing',
          pagerdutyUrl: 'https://test.pagerduty.com',
        },
        {
          team: 'testing',
        },
      ],
    },
  });
  const synth = Testing.synth(project);
  expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
});

test('without service catalog options', () => {
  const project = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
  });
  const synth = Testing.synth(project);
  expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
});
