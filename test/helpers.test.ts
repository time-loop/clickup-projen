import { getPinnedDeps } from '../src/helpers';

describe('getPinnedDeps', () => {
  it('returns empty list when empty', () => {
    expect(getPinnedDeps([])).toEqual([]);
  });
  it('returns same list when no version range is specified', () => {
    const dynamicDeps = ['ts-deepmerge', '@time-loop/cdk-ecs-fargate', 'fake-pkg'];
    expect(getPinnedDeps(dynamicDeps)).toEqual(dynamicDeps);
  });
  it('returns lowest acceptable versions when version range is specified', () => {
    const dynamicDeps = ['ts-deepmerge@1.3.4', 'some-fake-pkg@^2.9.8', 'fake-pkg2@~2.5.7'];
    expect(getPinnedDeps(dynamicDeps)).toEqual(['ts-deepmerge@1.3.4', 'some-fake-pkg@2.9.8', 'fake-pkg2@2.5.7']);
  });
});
