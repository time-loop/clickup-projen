import { synthSnapshot } from 'projen/lib/util/synth';
import { clickupEcsService, ecsServiceDeployWorkflow } from '../src';
import { ecsServiceBuildPublishWorkflow } from '../src/workflows/ecs-service-build';
import { ecsServiceCIWorkflow } from '../src/workflows/ecs-service-ci';
import { ecsServiceCDWorkflow } from '../src/workflows/ecs-service-cd';

describe('ClickUpTypeScriptEcsServiceProject', () => {
  describe('default action metadata', () => {
    const project = new clickupEcsService.ClickUpTypeScriptEcsServiceProject({
      name: 'test',
      serviceName: 'test',
      defaultReleaseBranch: 'main',
    });
    const synthed = synthSnapshot(project);

    it('creates expected files', () => {
      const files = Object.keys(synthed);
      expect(files).toMatchSnapshot();
    });

    it('has appropriate package.json', () => {
      expect(synthed['package.json']).toMatchSnapshot();
    });

    describe('github workflows', () => {
      it('creates expected workflow files', () => {
        const githubWorkflows = Object.keys(synthed).filter((file) => file.includes('.github'));
        expect(githubWorkflows).toMatchSnapshot();
      });

      it('creates proper ecs-service-build-publish.yml contents', () => {
        const workflow = synthed[ecsServiceBuildPublishWorkflow.WORKFLOW_LOCATION];
        expect(workflow).toMatchSnapshot();
      });

      it('creates proper ecs-service-deploy.yml contents', () => {
        const workflow = synthed[ecsServiceDeployWorkflow.WORKFLOW_LOCATION];
        expect(workflow).toMatchSnapshot();
      });

      it('creates proper harness-deploy.yml contents', () => {
        const workflow = synthed[ecsServiceDeployWorkflow.HARNESS_WORKFLOW_LOCATION];
        expect(workflow).toMatchSnapshot();
      });

      it('creates proper ecs-service-ci.yml contents', () => {
        const workflow = synthed[ecsServiceCIWorkflow.WORKFLOW_LOCATION];
        expect(workflow).toMatchSnapshot();
      });

      it('creates proper ecs-service-cd.yml contents', () => {
        const workflow = synthed[ecsServiceCDWorkflow.WORKFLOW_LOCATION];
        expect(workflow).toMatchSnapshot();
      });
    });

    describe('sample app code', () => {
      it.each(['Dockerfile', 'scripts/docker-healthcheck.sh', 'scripts/docker-build.sh'])(`creates %s`, (fileName) => {
        const file = synthed[fileName];
        expect(file).not.toBeUndefined();
        expect(file).toMatchSnapshot();
      });
    });

    // const workflow = synthed['.github/workflows/ecs-service-deploy.yml'];
    // console.log(workflow);
  });
});
