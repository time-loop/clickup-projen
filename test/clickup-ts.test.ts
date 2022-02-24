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
  test('should add prefix when missing', () => {
    const p = new clickupTs.ClickUpTypeScriptProject({
      name: 'missing-prefix',
      defaultReleaseBranch: 'main',
    });
    expect(p.name).toBe('@time-loop/missing-prefix');
  });
});
