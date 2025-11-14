import { Testing, javascript } from 'projen';
import { clickupTs } from '../src';

describe('ClickUpTypeScriptProject', () => {
  describe('defaults', () => {
    const p = new clickupTs.ClickUpTypeScriptProject({
      name: '@time-loop/test',
      defaultReleaseBranch: 'main',
    });
    const synth = Testing.synth(p);
    // console.log(Object.getOwnPropertyNames(synth));
    ['package.json', '.github/workflows/upgrade-main.yml', '.mergify.yml', '.github/workflows/release.yml'].forEach(
      (f) => {
        test(f, () => {
          expect(synth[f]).toMatchSnapshot();
        });
      },
    );
    test('prettier is enabled', () => {
      expect(p.prettier).toBeTruthy();
    });
    test('jest is enabled', () => {
      expect(p.jest).toBeTruthy();
    });
    test('min node version is 18', () => {
      expect(synth['package.json'].engines.node).toBe('>= 18.17.1');
    });
    test('codecov is disabled by default', () => {
      expect(synth['codecov.yml']).toBeUndefined();
    });
    // TODO: soooo many more tests need to be written here.
  });

  describe('codecov', () => {
    test('can be explicitly enabled', () => {
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: '@time-loop/test',
        defaultReleaseBranch: 'main',
        codeCov: true,
      });
      const synth = Testing.synth(p);
      expect(synth['codecov.yml']).toBeDefined();
      expect(synth['codecov.yml']).toMatchSnapshot();
    });
  });

  describe('name', () => {
    let envCache = process.env;

    beforeEach(() => {
      process.env = envCache;
    });

    test('should add prefix when missing', () => {
      jest.spyOn(console, 'log');
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: 'missing-prefix',
        defaultReleaseBranch: 'main',
      });
      expect(p.name).toBe('@time-loop/missing-prefix');
    });

    test('should respect GITHUB_OWNER', () => {
      jest.spyOn(console, 'log');
      process.env.GITHUB_OWNER = 'fizzle';
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: 'missing-prefix',
        defaultReleaseBranch: 'main',
      });
      expect(p.name).toBe('@fizzle/missing-prefix');
    });
  });
  describe('docgen', () => {
    const projenDocgenTaskName = 'docgen';
    const clickupDocgenTaskName = 'typedocDocgen';
    const commonOpts: clickupTs.ClickUpTypeScriptProjectOptions = {
      name: 'random-prefix',
      defaultReleaseBranch: 'main',
    };

    test('succeeds with defaults', () => {
      new clickupTs.ClickUpTypeScriptProject(commonOpts);
    });

    test('includes markdown plugin by default', () => {
      const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
      expect(project.deps.getDependency('typedoc-plugin-markdown')).toBeDefined();
    });

    test('excludes markdown plugin when html attr is set', () => {
      const project = new clickupTs.ClickUpTypeScriptProject({ ...commonOpts, docgenOptions: { html: true } });
      const getDep = () => {
        project.deps.getDependency('typedoc-plugin-markdown');
      };
      expect(getDep).toThrowError();
    });

    test('includes typedocDocgen task by default', () => {
      const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
      expect(project.tasks.tryFind(clickupDocgenTaskName)).toBeDefined();
      expect(project.tasks.tryFind(projenDocgenTaskName)).toBeUndefined();
    });

    test('contains no docgen task when docgen is false', () => {
      const project = new clickupTs.ClickUpTypeScriptProject({ ...commonOpts, docgen: false });
      [clickupDocgenTaskName, projenDocgenTaskName].forEach((task) =>
        expect(project.tasks.tryFind(task)).toBeUndefined(),
      );
    });

    test('creates typedoc config JSON file', () => {
      const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
      const matchedFiles = project.files.filter((file) => file.path === 'typedoc.json');
      expect(matchedFiles).toHaveLength(1);
    });

    test('respects configFilePath attr when set', () => {
      const testOverride = 'test.json';
      const project = new clickupTs.ClickUpTypeScriptProject({
        ...commonOpts,
        docgenOptions: { configFilePath: testOverride },
      });
      const matchedFiles = project.files.filter((file) => file.path === testOverride);
      expect(matchedFiles).toHaveLength(1);
    });
  });
  describe('pnpm', () => {
    const p = new clickupTs.ClickUpTypeScriptProject({
      name: '@time-loop/test',
      defaultReleaseBranch: 'main',
      packageManager: javascript.NodePackageManager.PNPM,
      pnpmVersion: '9',
    });
    const synth = Testing.synth(p);
    it('packageManager', () => {
      expect(synth['package.json'].packageManager).toBe('pnpm@10.22.0');
      expect(synth['package.json'].pnpm).toEqual({
        onlyBuiltDependencies: ['esbuild', 'unrs-resolver'],
      });
    });

    const npmrcEntries = [
      'package-manager-strict=false',
      'manage-package-manager-versions=true',
      'use-node-version=22.14.0',
    ];
    it.each(npmrcEntries)('%s', (npmrcEntry) => {
      expect(synth['.npmrc']).toContain(npmrcEntry);
    });
  });

  describe('workflowNodeVersion', () => {
    const p = new clickupTs.ClickUpTypeScriptProject({
      name: '@time-loop/test',
      defaultReleaseBranch: 'main',
      packageManager: javascript.NodePackageManager.PNPM,
      pnpmVersion: '9',
      workflowNodeVersion: '22.0.0', // test explicit downgrade
    });
    const synth = Testing.synth(p);
    it('use-node-version in .npmrc file', () => {
      expect(synth['.npmrc']).toContain('use-node-version=22.0.0');
    });
  });

  describe('explicit package manager override', () => {
    describe('npm', () => {
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: '@time-loop/test',
        defaultReleaseBranch: 'main',
        packageManager: javascript.NodePackageManager.NPM,
      });
      const synth = Testing.synth(p);
      it('should use npm when explicitly set', () => {
        expect(p.package.packageManager).toBe(javascript.NodePackageManager.NPM);
      });
      it('should not have pnpm packageManager field', () => {
        expect(synth['package.json'].packageManager).toBeUndefined();
      });
      it('should not have pnpm .npmrc entries', () => {
        if (synth['.npmrc']) {
          expect(synth['.npmrc']).not.toContain('package-manager-strict');
          expect(synth['.npmrc']).not.toContain('manage-package-manager-versions');
          expect(synth['.npmrc']).not.toContain('use-node-version');
        }
        // If .npmrc doesn't exist, that's also fine for npm
      });
    });

    describe('yarn', () => {
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: '@time-loop/test',
        defaultReleaseBranch: 'main',
        packageManager: javascript.NodePackageManager.YARN,
      });
      const synth = Testing.synth(p);
      it('should use yarn when explicitly set', () => {
        expect(p.package.packageManager).toBe(javascript.NodePackageManager.YARN);
      });
      it('should not have pnpm packageManager field', () => {
        expect(synth['package.json'].packageManager).toBeUndefined();
      });
      it('should not have pnpm .npmrc entries', () => {
        if (synth['.npmrc']) {
          expect(synth['.npmrc']).not.toContain('package-manager-strict');
          expect(synth['.npmrc']).not.toContain('manage-package-manager-versions');
          expect(synth['.npmrc']).not.toContain('use-node-version');
        }
        // If .npmrc doesn't exist, that's also fine for yarn
      });
    });
  });
});

describe('normalizeName', () => {
  const envCache = process.env;

  beforeEach(() => {
    process.env = envCache;
    delete process.env.GITHUB_OWNER;
  });

  test('should silently pass when prefix is present', () => {
    const logSpy = jest.spyOn(console, 'log');
    const name = clickupTs.normalizeName('@time-loop/has-prefix');
    expect(name).toBe('@time-loop/has-prefix');
    expect(logSpy).not.toHaveBeenCalled();
  });

  test('should add prefix and complain when missing', () => {
    const logSpy = jest.spyOn(console, 'log');
    const name = clickupTs.normalizeName('missing-prefix');
    expect(name).toBe('@time-loop/missing-prefix');
    expect(logSpy).toHaveBeenCalledWith(
      'Adding mandatory prefix @time-loop/ to name. New name: @time-loop/missing-prefix',
    );
  });

  test('should respect GITHUB_OWNER', () => {
    const logSpy = jest.spyOn(console, 'log'); // silence console.log
    process.env.GITHUB_OWNER = 'fizzle';
    const name = clickupTs.normalizeName('missing-prefix');
    expect(name).toBe('@fizzle/missing-prefix');
    expect(logSpy).toHaveBeenCalled();
  });
});
