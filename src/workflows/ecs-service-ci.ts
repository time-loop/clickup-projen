import { YamlFile } from 'projen';
import { JobPermission } from 'projen/lib/github/workflows-model';
import { ecsServiceBuildPublishWorkflow } from './ecs-service-build';
import { getVersionJob } from './utils/getVersion';
import { clickupEcsService } from '../clickup-ecs-service';

export module ecsServiceCIWorkflow {
  export const WORKFLOW_LOCATION = '.github/workflows/ecs-service-ci.yml';
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
    options: ecsServiceBuildPublishWorkflow.BuildPublishOptionsConfig,
    override?: any,
  ): void {
    ecsServiceBuildPublishWorkflow.addBuildPublishWorkflowYml(project, options, override);
    setBuildReleaseTasks(project);
    new YamlFile(project, ecsServiceCIWorkflow.WORKFLOW_LOCATION, {
      obj: {
        ...getContinuousIntegrationWorkflow(project),
        ...override,
      },
    });
  }

  export function getContinuousIntegrationWorkflow(project: clickupEcsService.ClickUpTypeScriptEcsServiceProject) {
    const workflow = {
      name: 'Continuous Integration',
      on: {
        pull_request: {},
        workflow_dispatch: {},
      },
      env: {
        FORCE_COLOR: '3', // Fix terminal color output
        GIT_TAG_PREFIX: 'backend',
      },
      jobs: {
        ...getVersionJob(project),
        ...createBuildPublishJob(project),
      },
    };
    return workflow;
  }

  function createBuildPublishJob(project: clickupEcsService.ClickUpTypeScriptEcsServiceProject) {
    const job = {
      'build-publish-docker': {
        name: 'Build and Publish Docker Image to ECR',
        permissions: {
          contents: JobPermission.READ,
          actions: JobPermission.READ,
          packages: JobPermission.READ,
        },
        needs: ['get-version'],
        uses: `./${ecsServiceBuildPublishWorkflow.WORKFLOW_LOCATION}`,
        secrets: 'inherit',
        with: {
          version: '${{ needs.get-version.outputs.version }}',
          'service-name': project.serviceName,
          'skip-health-check': false, // TODO: Not hardcode false
          'is-nest-app': true, // TODO: Not hardcode true
          'skip-vulnerability-scan': true, // TODO: Not hardcode true
        },
      },
    };
    return job;
  }
}
