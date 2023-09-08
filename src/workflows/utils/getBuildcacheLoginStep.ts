export function getBuildcacheLoginStep(inputVars?: Record<string, string>) {
  const step = {
    name: 'Buildcache Repo Login',
    uses: 'time-loop/github-actions/dist/docker-ecr-login@53f03c9bc36389e6b4e671bd8a3cc6286ef37044', // TODO: Do not use prerelease version on branch
    id: 'buildcache',
    with: {
      'aws-access-key-id': '${{ secrets.ECR_BUILD_CACHE_AWS_ACCESS_KEY_ID }}',
      'aws-secret-access-key': '${{ secrets.ECR_BUILD_CACHE_AWS_SECRET_ACCESS_KEY }}',
      'aws-region': '${{ secrets.ECR_BUILD_CACHE_AWS_REGION }}',
      'ecr-repo-name': 'monorepo-buildcache',
      ...inputVars,
    },
  };
  return step;
}
