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
    describe('snapshot', () => {
      test('codecov.yml', () => {
        expect(synth['codecov.yml']).toMatchSnapshot();
      });
      test('package.json', () => {
        expect(synth['package.json']).toMatchSnapshot();
      });
      test('upgrade-main', () => {
        expect(synth['.github/workflows/upgrade-main.yml']).toMatchSnapshot();
      });
      test('mergify', () => {
        expect(synth['mergfiy.yml']).toMatchSnapshot();
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
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: 'missing-prefix',
        defaultReleaseBranch: 'main',
      });
      expect(p.name).toBe('@time-loop/missing-prefix');
    });

    test('should respect GITHUB_OWNER', () => {
      process.env.GITHUB_OWNER = 'fizzle';
      const p = new clickupTs.ClickUpTypeScriptProject({
        name: 'missing-prefix',
        defaultReleaseBranch: 'main',
      });
      expect(p.name).toBe('@fizzle/missing-prefix');
    });
  });
});
