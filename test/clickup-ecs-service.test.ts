import { synthSnapshot } from 'projen/lib/util/synth';
import { clickupEcsService, ecsServiceDeployWorkflow } from '../src';
import { ecsServiceBuildPublishWorkflow } from '../src/workflows/ecs-service-build';

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

      it('adds CI workflow to build workflow', () => {
        expect(project.buildWorkflow).not.toBeUndefined();
        const workflow = synthed['.github/workflows/build.yml'];
        expect(workflow).toMatchSnapshot();
      });

      it('adds CD workflow to release workflow', () => {
        expect(project.release).not.toBeUndefined();
        const workflow = synthed['.github/workflows/release.yml'];
        expect(workflow).toMatchSnapshot();
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
