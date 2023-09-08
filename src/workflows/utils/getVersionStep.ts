import { NodeProject } from 'projen/lib/javascript';

/**
 * To reference the version, use ${{ steps.event_metadata.outputs.release_tag }}
 * @param project
 * @returns
 */
export const getVersionStep = (project: NodeProject, download: boolean = true) => {
  const downloadStep = {
    name: 'Download build artifacts',
    uses: 'actions/download-artifact@v3',
    with: {
      name: 'build-artifact',
      path: project.release!.artifactsDirectory,
    },
  };
  const versionStep = {
    name: 'Get version',
    id: 'event_metadata',
    run: `echo "release_tag=$(cat ${project.release!.artifactsDirectory}/releasetag.txt)" >> $GITHUB_OUTPUT`,
  };
  const steps = download ? [downloadStep, versionStep] : [versionStep];
  return steps;
};
