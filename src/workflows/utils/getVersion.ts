import { JobPermission } from 'projen/lib/github/workflows-model';
import { NodeProject } from 'projen/lib/javascript';
import { getCheckoutStep } from './getCheckoutStep';

/**
 * To reference the version, use ${{ steps.event_metadata.outputs.release_tag }}
 * @param project
 * @returns
 */
export const getVersionSteps = (project: NodeProject, download: boolean = true) => {
  const downloadStep = {
    name: 'Download build artifacts',
    uses: 'actions/download-artifact@v3',
    with: {
      name: 'build-artifact',
      path: project.release!.artifactsDirectory,
    },
  };
  const inlineGetVersionStep = {
    name: 'Bump to Create Version Tag',
    run: 'test "$RELEASE" = "true" && npx projen bump || PRERELEASE=$(git rev-parse HEAD) npx projen bump',
  };
  const inlineUndoGetVersionStep = {
    name: 'Unbump to Return to Previous State',
    run: 'test "$RELEASE" = "true" && npx projen unbump || PRERELEASE=$(git rev-parse HEAD) npx projen unbump',
  };
  const versionStep = {
    name: 'Get version',
    id: 'event_metadata',
    run: `echo "release_tag=$(cat ${project.release!.artifactsDirectory}/releasetag.txt)" >> $GITHUB_OUTPUT`,
  };
  const steps = download ? [downloadStep, versionStep] : [inlineGetVersionStep, versionStep, inlineUndoGetVersionStep];
  return steps;
};

export const getVersionJob = (project: NodeProject) => {
  const job = {
    'get-version': {
      name: 'Get Version',
      'runs-on': 'ubuntu-latest',
      permissions: {
        contents: JobPermission.READ,
        actions: JobPermission.READ,
        packages: JobPermission.READ,
      },
      outputs: {
        version: '${{ steps.event_metadata.outputs.release_tag }}',
      },
      steps: [
        getCheckoutStep(),
        {
          name: 'GitHub Packages authorization',
          env: {
            NPM_TOKEN: '${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
          },
          run: [
            'cat > .npmrc <<EOF',
            '//npm.pkg.github.com/:_authToken=${NPM_TOKEN}',
            '@time-loop:registry=https://npm.pkg.github.com/',
            'EOF',
          ].join('\n'),
        },
        {
          name: 'Install dependencies',
          run: 'yarn install --check-files --frozen-lockfile',
        },
        ...getVersionSteps(project, false),
      ],
    },
  };
  return job;
};
