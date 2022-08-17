import { Testing } from 'projen';
import { clickupTs } from '../src';

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
  describe('docgenOptions', () => {
    const projenDocgenTaskName = 'docgen';
    const clickupDocgenTaskName = 'typedocDocgen';
    const commonOpts: clickupTs.ClickUpTypeScriptProjectOptions = {
      name: 'random-prefix',
      defaultReleaseBranch: 'main',
      docgen: true,
      docgenOptions: {
        configFileContents: {},
      },
    };

    test('should throw Error when docgen is not set', () => {
      const expectedErr = 'docgen attribute must be set to utilize docgenOptions.';
      const createProject = () => {
        new clickupTs.ClickUpTypeScriptProject({ ...commonOpts, docgen: undefined });
      };
      expect(createProject).toThrowError(expectedErr);
    });

    test('should succeed when docgen is also set', () => {
      new clickupTs.ClickUpTypeScriptProject(commonOpts);
    });

    test('should include markdown plugin by default', () => {
      const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
      expect(project.deps.getDependency('typedoc-plugin-markdown')).toBeDefined();
    });

    test('should include typedocDocgen task', () => {
      const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
      expect(project.tasks.tryFind(clickupDocgenTaskName)).toBeDefined();
      expect(project.tasks.tryFind(projenDocgenTaskName)).toBeUndefined();
    });

    test('should not include markdown plugin when html attr is set', () => {
      const project = new clickupTs.ClickUpTypeScriptProject({ ...commonOpts, docgenOptions: { html: true } });
      const getDep = () => {
        project.deps.getDependency('typedoc-plugin-markdown');
      };
      expect(getDep).toThrowError();
    });

    test('should create typedoc config JSON file', () => {
      const project = new clickupTs.ClickUpTypeScriptProject(commonOpts);
      const matchedFiles = project.files.filter((file) => file.path === 'typedoc.json');
      expect(matchedFiles).toHaveLength(1);
    });

    test('should use projen.TypedocDocgen when options are undefined', () => {
      const project = new clickupTs.ClickUpTypeScriptProject({ ...commonOpts, docgenOptions: undefined });
      const matchedFiles = project.files.filter((file) => file.path === 'typedoc.json');
      expect(matchedFiles).toHaveLength(0);
      const getDep = () => {
        project.deps.getDependency('typedoc-plugin-markdown');
      };
      expect(getDep).toThrowError();
      expect(project.tasks.tryFind(projenDocgenTaskName)).toBeDefined();
      expect(project.tasks.tryFind(clickupDocgenTaskName)).toBeUndefined();
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
