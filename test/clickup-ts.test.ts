import { Testing } from 'projen';
import { clickupTs } from '../src';
import { getPinnedDeps } from '../src/helpers';

describe('ClickUpTypeScriptProject', () => {
  describe('defaults', () => {
    const p = new clickupTs.ClickUpTypeScriptProject({
      name: '@time-loop/test',
      defaultReleaseBranch: 'main',
    });
    const synth = Testing.synth(p);
    // console.log(Object.getOwnPropertyNames(synth));
    ['codecov.yml', 'package.json', '.github/workflows/upgrade-main.yml', '.mergify.yml'].forEach((f) => {
      test(f, () => {
        expect(synth[f]).toMatchSnapshot();
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
  describe('peerDeps', () => {
    const commonOpts: clickupTs.ClickUpTypeScriptProjectOptions = {
      name: 'random-prefix',
      defaultReleaseBranch: 'main',
      peerDeps: ['@time-loop/cdk-ecs-fargate@^1.0.3', 'ts-deepmerge@2.5.3'],
    };
    const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
    const synth = Testing.synth(project);
    const pkgJson = synth['package.json'];

    it('is set correctly', () => {
      // Need to stringify, then parse to make this accessible
      const peerDeps: Record<string, string> = JSON.parse(JSON.stringify(pkgJson.peerDependencies));
      expect(peerDeps).toBeDefined();
      const actualPeerDeps = Object.entries(peerDeps).map((kvPair) => {
        return kvPair.join('@');
      });
      commonOpts.peerDeps!.forEach((dep) => {
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
      const expectedDevDeps = getPinnedDeps(commonOpts.peerDeps!);
      expectedDevDeps.forEach((dep) => {
        expect(actualDevDeps.includes(dep)).toBeTruthy();
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
