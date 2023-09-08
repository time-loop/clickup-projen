import { JobPermission } from 'projen/lib/github/workflows-model';
import { ecsServiceBuildPublishWorkflow } from './ecs-service-build';
import { getVersionStep } from './utils/getVersionStep';
import { clickupEcsService } from '../clickup-ecs-service';

export module ecsServiceCIWorkflow {
  export interface CIOptionsConfig extends ecsServiceBuildPublishWorkflow.BuildPublishOptionsConfig {}

  export function createContinuousIntegrationWorkflow(
    project: clickupEcsService.ClickUpTypeScriptEcsServiceProject,
    options: CIOptionsConfig,
    override?: any,
  ) {
    ecsServiceBuildPublishWorkflow.addBuildPublishWorkflowYml(project, options, override);

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
        ...getVersionStep(project, false),
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
