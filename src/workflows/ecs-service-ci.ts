import { JobPermission } from 'projen/lib/github/workflows-model';
import { ecsServiceBuildPublishWorkflow } from './ecs-service-build';
import { getCheckoutStep } from './utils/getCheckoutStep';
import { getVersionStep as getVersionSteps } from './utils/getVersionStep';
import { clickupEcsService } from '../clickup-ecs-service';

export module ecsServiceCIWorkflow {
  export interface CIOptionsConfig extends ecsServiceBuildPublishWorkflow.BuildPublishOptionsConfig {}

  /**
   * In order to get the version from the built artifact at CI time, we need to
   * include a prerelease version bump in the Build Task. But, when we do a
   * standard release, we do not want prerelease set. This accomplishes those
   * modifications to the Projen tasks.
   */
  function setBuildReleaseTasks(project: clickupEcsService.ClickUpTypeScriptEcsServiceProject) {
    // This section sets the Build Task to do Release stuff (includes releasetag.txt file)
    const cleanTask = project.addTask('clean-dist', {
      exec: 'rm -fr dist',
    });
    // Since this is prepending, add in reverse order!
    project.projectBuild.preCompileTask.prependExec(
      'test "$RELEASE" = "true" && npx projen bump || PRERELEASE=$(git rev-parse HEAD) npx projen bump',
    );
    project.projectBuild.preCompileTask.prependSpawn(cleanTask);
    project.projectBuild.packageTask.exec(
      'test "$RELEASE" = "true" && npx projen unbump || PRERELEASE=$(git rev-parse HEAD) npx projen unbump',
    );

    // This section sets the Release Task to not do the stuff Build now does (bump/unbump)
    const releaseTask = project.tasks.tryFind('release');
    releaseTask?.reset();
    releaseTask?.spawn(project.projectBuild.buildTask);
    releaseTask?.exec('git diff --ignore-space-at-eol --exit-code');

    // This output below just used for testing, can remove once finished
    // console.log(project.tasks.tryFind('pre-compile'));
    // console.log(project.tasks.tryFind('package'));
    // console.log(project.tasks.tryFind('build'));
    // console.log(project.tasks.tryFind('release'));
  }

  export function createContinuousIntegrationWorkflow(
    project: clickupEcsService.ClickUpTypeScriptEcsServiceProject,
    options: CIOptionsConfig,
    override?: any,
  ) {
    ecsServiceBuildPublishWorkflow.addBuildPublishWorkflowYml(project, options, override);
    setBuildReleaseTasks(project);
    project.buildWorkflow?.addPostBuildJob('ci', {
      name: 'Docker Build and Publish',
      env: {
        FORCE_COLOR: '3', // Fix terminal color output
        GIT_TAG_PREFIX: 'backend',
      },
      runsOn: ['ubuntu-latest'],
      permissions: {
        contents: JobPermission.READ,
        actions: JobPermission.READ,
        packages: JobPermission.READ,
      },
      steps: [
        getCheckoutStep(),
        ...getVersionSteps(project),
        {
          name: 'Build and Publish Docker Image to ECR',
          uses: `./${ecsServiceBuildPublishWorkflow.WORKFLOW_LOCATION}`,
          with: {
            version: '${{ steps.event_metadata.outputs.release_tag }}',
            'service-name': project.serviceName,
            'all-package-read-token': '${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
            'buildcache-aws-access-key-id': '${{ secrets.ECR_BUILD_CACHE_AWS_ACCESS_KEY_ID }}',
            'buildcache-aws-secret-access-key': '${{ secrets.ECR_BUILD_CACHE_AWS_SECRET_ACCESS_KEY }}',
            'buildcache-aws-region': '${{ secrets.ECR_BUILD_CACHE_AWS_REGION }}',
            'lacework-account-name': '${{ secrets.LW_ACCOUNT_NAME }}',
            'lacework-access-token': '${{ secrets.LW_ACCESS_TOKEN }}',
            'skip-health-check': false, // TODO: Not hardcode false
            'is-nest-app': true, // TODO: Not hardcode true
            'skip-vulnerability-scan': true, // TODO: Not hardcode true
          },
        },
      ],
    });
  }
}
