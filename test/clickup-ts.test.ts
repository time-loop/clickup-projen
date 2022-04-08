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
