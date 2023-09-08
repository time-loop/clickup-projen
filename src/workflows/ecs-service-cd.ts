import { JobPermission } from 'projen/lib/github/workflows-model';
import { ecsServiceDeployWorkflow } from './ecs-service-deploy';
import { getVersionStep } from './utils/getVersionStep';
import { clickupEcsService } from '../clickup-ecs-service';

export module ecsServiceCDWorkflow {
  export interface CDOptionsConfig extends ecsServiceDeployWorkflow.EcsServiceDeployOptionsConfig {}

  export function createContinuousDeliveryWorkflow(
    project: clickupEcsService.ClickUpTypeScriptEcsServiceProject,
    options: CDOptionsConfig,
    override?: any,
  ) {
    ecsServiceDeployWorkflow.addEcsServiceDeployWorkflowYml(project, options, override);

    project.release?.addJobs({
      cd: {
        name: `Deploy ${project.serviceName} to ECS`,
        runsOn: ['ubuntu-latest'],
        needs: ['release'], // Release job name from project.release
        permissions: {
          actions: JobPermission.READ,
          contents: JobPermission.READ,
          packages: JobPermission.READ,
        },
        steps: [
          ...getVersionStep(project),
          {
            name: 'Deploy',
            uses: `./${ecsServiceDeployWorkflow.WORKFLOW_LOCATION}`,
            with: {
              'service-name': project.serviceName,
              version: '${{ steps.event_metadata.outputs.release_tag }}',
              'harness-account-identifier': '${{ secrets.HARNESS_ACCOUNT_IDENTIFIER }}',
            },
          },
        ],
      },
    });
  }
}
