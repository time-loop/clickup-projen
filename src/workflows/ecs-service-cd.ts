import { YamlFile } from 'projen';
import { ecsServiceDeployWorkflow } from './ecs-service-deploy';
import { getVersionJob } from './utils/getVersion';
import { clickupEcsService } from '../clickup-ecs-service';

export module ecsServiceCDWorkflow {
  export const WORKFLOW_LOCATION = '.github/workflows/ecs-service-cd.yml';
  export interface CDOptionsConfig extends ecsServiceDeployWorkflow.EcsServiceDeployOptionsConfig {}

  export function createContinuousDeliveryWorkflow(
    project: clickupEcsService.ClickUpTypeScriptEcsServiceProject,
    options: CDOptionsConfig,
    override?: any,
  ) {
    ecsServiceDeployWorkflow.addEcsServiceDeployWorkflowYml(project, options, override);
    new YamlFile(project, ecsServiceCDWorkflow.WORKFLOW_LOCATION, {
      obj: {
        ...getContinuousDeliveryWorkflow(project),
        ...override,
      },
    });
  }

  function getContinuousDeliveryWorkflow(project: clickupEcsService.ClickUpTypeScriptEcsServiceProject) {
    const workflow = {
      name: `Deploy ${project.serviceName} to ECS`,
      on: {
        push: {
          branches: project.release?.branches,
        },
      },
      env: {
        RELEASE: true,
      },
      jobs: {
        ...getVersionJob(project),
        Deploy: {
          uses: `./${ecsServiceDeployWorkflow.WORKFLOW_LOCATION}`,
          needs: ['get-version'],
          with: {
            'service-name': project.serviceName,
            version: '${{ needs.get-version.outputs.version }}',
            'harness-account-identifier': '${{ secrets.HARNESS_ACCOUNT_IDENTIFIER }}',
          },
        },
      },
    };
    return workflow;
  }
}
