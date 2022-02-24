import { clickupTs } from '../src';

describe('ClickUpTypeScriptProject', () => {
  describe('defaults', () => {
    const p = new clickupTs.ClickUpTypeScriptProject({
      name: '@time-loop/test',
      defaultReleaseBranch: 'main',
    });
    test('prettier is enabled', () => {
      expect(p.prettier).toBeTruthy();
    });
    test('jest is enabled', () => {
      expect(p.jest).toBeTruthy();
    });
    // TODO: soooo many more tests need to be written here.
  });
  test('should throw when missing prefix', () => {
    expect(() => {
      new clickupTs.ClickUpTypeScriptProject({
        name: 'nope',
        defaultReleaseBranch: 'main',
      });
    }).toThrow(/does not start with/);
  });
});
