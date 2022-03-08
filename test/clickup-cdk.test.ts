import { Testing } from 'projen';
import { clickupCdk } from '../src';

describe('ClickUpCdkTypeScriptApp', () => {
  describe('defaults', () => {
    const p = new clickupCdk.ClickUpCdkTypeScriptApp({
      name: 'test',
      cdkVersion: '2.1.0',
      defaultReleaseBranch: 'main',
    });
    const synth = Testing.synth(p);
    ['README.md', 'package.json', 'src/main.ts', 'src/widget.ts', 'test/widget.test.ts'].forEach((file) => {
      test(`snapshot ${file}`, () => {
        expect(synth[file]).toMatchSnapshot();
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
});
