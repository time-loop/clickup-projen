import path from 'path';
import { javascript, Testing } from 'projen';
import { requiredParams } from './requiredParams';
import { clickupCdk } from '../src';
import { datadogServiceCatalog } from '../src/datadog-service-catalog';

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

    describe('node20', () => {
      p = new clickupCdk.ClickUpCdkTypeScriptApp({
        ...requiredParams,
        minNodeVersion: '20.5.1',
        workflowNodeVersion: '20.5.1',
      });
      const synth = Testing.synth(p);
      ['.nvmrc', 'package.json', '.github/workflows/release.yml'].forEach((file) => {
        test(file, () => {
          expect(synth[file]).toMatchSnapshot();
        });
      });
    });

    describe('pnpm', () => {
      p = new clickupCdk.ClickUpCdkTypeScriptApp({
        ...requiredParams,
        packageManager: javascript.NodePackageManager.PNPM,
      });
      const synth = Testing.synth(p);
      it('packageManager', () => {
        expect(synth['package.json'].packageManager).toBe('pnpm@9.15.5');
      });

      const npmrcEntries = [
        'package-manager-strict=false',
        // 'manage-package-manager-versions=true',
        'use-node-version=22.14.0',
      ];
      it.each(npmrcEntries)('%s', (npmrcEntry) => {
        expect(synth['.npmrc']).toContain(npmrcEntry);
      });

      ['.npmrc', 'package.json'].forEach((file) => {
        test(file, () => {
          expect(synth[file]).toMatchSnapshot();
        });
      });
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

    describe('pnpm', () => {
      p = new clickupCdk.ClickUpCdkConstructLibrary({
        ...commonProps,
        packageManager: javascript.NodePackageManager.PNPM,
      });
      const synth = Testing.synth(p);
      it('packageManager', () => {
        expect(synth['package.json'].packageManager).toBe('pnpm@9.15.5');
      });

      const npmrcEntries = [
        'package-manager-strict=false',
        'manage-package-manager-versions=true',
        'use-node-version=22.14.0',
        'node-linker=hoisted',
      ];
      it.each(npmrcEntries)('%s', (npmrcEntry) => {
        expect(synth['.npmrc']).toContain(npmrcEntry);
      });
    });

    describe('workflowNodeVersion', () => {
      p = new clickupCdk.ClickUpCdkConstructLibrary({
        ...commonProps,
        packageManager: javascript.NodePackageManager.PNPM,
        workflowNodeVersion: '22.0.0',
      });
      const synth = Testing.synth(p);
      it('use-node-version in .npmrc file', () => {
        expect(synth['.npmrc']).toContain('use-node-version=22.0.0');
      });
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

const serviceInfo = [
  {
    serviceName: 'test-service',
    description: 'test description test-service 1',
    application: 'clickup',
    tier: 'critical',
    lifecycle: 'unit-test',
    team: 'testing',
    pagerdutyUrl: 'https://test.pagerduty.com',
  },
];

const contacts = [
  {
    name: 'contact test',
    type: datadogServiceCatalog.ContactType.EMAIL,
    contact: 'contacttest@clickup.com',
  },
];

const links = [
  {
    name: 'link test',
    type: datadogServiceCatalog.LinkType.OTHER,
    url: 'https://test.clickup.com',
  },
];

test('sending service catalog options serviceInfo', () => {
  const project = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
    serviceCatalogOptions: {
      serviceInfo: serviceInfo,
    },
  });
  const synth = Testing.synth(project);
  expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
});

test('sending service catalog options serviceInfo and contacts', () => {
  const project = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
    serviceCatalogOptions: {
      serviceInfo: serviceInfo,
      contacts: contacts,
    },
  });
  const synth = Testing.synth(project);
  expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
});

test('sending service catalog options serviceInfo, contacts and links', () => {
  const project = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
    serviceCatalogOptions: {
      serviceInfo: serviceInfo,
      contacts: contacts,
      links: links,
    },
  });
  const synth = Testing.synth(project);
  expect(synth[path.join('.github', 'workflows', 'release.yml')]).toMatchSnapshot();
});

test('sending service catalog options with default values in serviceInfo, contacts and links', () => {
  const project = new clickupCdk.ClickUpCdkTypeScriptApp({
    ...requiredParams,
    serviceCatalogOptions: {
      serviceInfo: [
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
