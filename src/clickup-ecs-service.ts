import * as fs from 'fs';
import * as path from 'path';
import { Component, SampleFile } from 'projen';
import merge from 'ts-deepmerge';
import { clickupTs } from './clickup-ts';
import { renovateWorkflow } from './renovate-workflow';
import { ecsServiceCDWorkflow } from './workflows/ecs-service-cd';
import { ecsServiceCIWorkflow } from './workflows/ecs-service-ci';
import { ecsServiceDeployWorkflow } from './workflows/ecs-service-deploy';

export module clickupEcsService {
  export const defaults: Omit<ClickUpTypeScriptEcsServiceProjectOptions, 'name' | 'serviceName'> = {
    ...clickupTs.defaults,
    workflowNodeVersion: '16',
  };

  export interface ClickUpTypeScriptEcsServiceProjectOptions extends clickupTs.ClickUpTypeScriptProjectOptions {
    readonly deployWorkflowOptions?: ecsServiceDeployWorkflow.EcsServiceDeployOptionsConfig;
    readonly serviceName: string;
    readonly serviceHealthcheckPath?: string;
  }

  export class ClickUpTypeScriptEcsServiceProject extends clickupTs.ClickUpTypeScriptProject {
    readonly workflowNodeVersion: string;
    readonly serviceName: string;
    readonly serviceHealthcheckPath: string;

    constructor(options: ClickUpTypeScriptEcsServiceProjectOptions) {
      const serviceHealthcheckPath = options.serviceHealthcheckPath ?? `${options.serviceName}/health`;
      let mergedOptions = merge(
        defaults,
        {
          deps: clickupTs.deps,
          deployWorkflowOptions: {
            deployEnvs: [ecsServiceDeployWorkflow.ClickUpHarnessEnv.QA],
            serviceHealthcheckPath,
          },
        },
        options,
        {
          // Disable projen's built-in docgen class
          docgen: undefined,
          name: clickupTs.normalizeName(options.name),
          renovatebotOptions: renovateWorkflow.getRenovateOptions(options.renovateOptionsConfig),
        },
      );
      super(mergedOptions);
      this.workflowNodeVersion = mergedOptions.workflowNodeVersion!;
      this.serviceName = options.serviceName;
      this.serviceHealthcheckPath = serviceHealthcheckPath;

      new AppSampleCode(this);

      ecsServiceCIWorkflow.createContinuousIntegrationWorkflow(this, {
        ...mergedOptions,
        nodeVersion: this.workflowNodeVersion,
      });

      ecsServiceCDWorkflow.createContinuousDeliveryWorkflow(this, {
        ...mergedOptions,
        ...mergedOptions.deployWorkflowOptions!,
        nodeVersion: this.workflowNodeVersion,
      });
    }
  }

  class AppSampleCode extends Component {
    constructor(project: ClickUpTypeScriptEcsServiceProject) {
      super(project);

      new SampleFile(project, 'Dockerfile', {
        contents: this.renderSample('Dockerfile.sample'),
      });

      new SampleFile(project, 'scripts/docker-healthcheck.sh', {
        contents: this.renderSample('docker-healthcheck.sh.sample', {
          '<%SERVICE_HEALTHCHECK_PATH%>': project.serviceHealthcheckPath,
        }),
      });

      new SampleFile(project, 'scripts/docker-build.sh', {
        contents: this.renderSample('docker-build.sh.sample', {
          '<%SERVICE_NAME%>': project.serviceName,
        }),
      });
    }

    private getSample(fileName: string): string {
      return fs.readFileSync(path.join(__dirname, 'samples', fileName), 'utf-8');
    }

    private renderSample(sampleFileName: string, vars?: { [toReplace: string]: string }): string {
      let contents = this.getSample(sampleFileName);

      if (vars) {
        const toReplace = Object.keys(vars);
        toReplace.map((key) => {
          contents = contents.replace(new RegExp(key, 'g'), vars[key]);
        });
      }
      return contents;
    }
  }
}
