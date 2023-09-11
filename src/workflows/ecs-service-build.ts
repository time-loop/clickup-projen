import { YamlFile } from 'projen';
import { getBuildcacheLoginStep } from './utils/getBuildcacheLoginStep';
import { getCheckoutStep } from './utils/getCheckoutStep';
import { clickupEcsService } from '../clickup-ecs-service';
import { OptionalNodeVersion } from '../optional-node-version';

export module ecsServiceBuildPublishWorkflow {
  const DEFAULT_RETRY_ACTION = 'nick-fields/retry@943e742917ac94714d2f408a0e8320f2d1fcafcd'; // v2.8.3
  export const WORKFLOW_LOCATION = '.github/workflows/ecs-service-build-publish.yml';

  function createBuildPublishWorkflow(options: BuildPublishOptionsConfig) {
    const nodeVersion = options.nodeVersion ?? '16';
    const dockerBuildJobs = getDockerBuildJobs({ ...options, nodeVersion });
    const dockerBuildJobNames = Object.keys(dockerBuildJobs);
    const defaultWorkflow = {
      name: 'Build and Publish Service Image to ECR',

      on: {
        workflow_call: {
          inputs: {
            'service-name': {
              required: true,
              type: 'string',
            },
            'docker-build-args': {
              required: false,
              description: 'Build arguments passed to the docker build command',
              type: 'string',
              default: [
                '--progress=plain \\',
                '--secret "id=npmrc,src=${HOME}/.npmrc" \\',
                '--iidfile /tmp/IMAGE_ID',
              ].join('\n'),
            },
            'is-nest-app': {
              type: 'boolean',
              default: true,
            },
            'skip-health-check': {
              type: 'boolean',
              default: false,
            },
            'skip-vulnerability-scan': {
              type: 'boolean',
              default: false,
            },
            version: {
              description: 'The version number that was created for the deploy.',
              required: true,
              type: 'string',
            },
          },
        },
      },

      env: {
        DOCKER_TAG_COMMIT: 'git-sha-${{ inputs.service-name }}-${GITHUB_SHA}',
        DOCKER_TAG_BASE: 'git-ref-${{ inputs.service-name }}-${GITHUB_BASE_REF//\\//-}',
        DOCKER_TAG_HEAD: 'git-ref-${{ inputs.service-name }}-${GITHUB_HEAD_REF//\\//-}',
        DOCKER_TAG_CUR: 'git-ref-${{ inputs.service-name }}-${GITHUB_REF_NAME//\\//-}',
        DOCKER_TAG_DRAFT_COMMIT: 'draft-git-sha-${{ inputs.service-name }}-${GITHUB_SHA}',
        DOCKER_TAG_DRAFT_CUR: 'draft-git-ref-${{ inputs.service-name }}-${GITHUB_REF_NAME//\\//-}',
      },

      jobs: {
        ...dockerBuildJobs,
        ...createDockerVulnerabilityScanJob(dockerBuildJobNames),
        ...createDockerValidateJob(dockerBuildJobNames),
        ...createDockerPublishToBuildcacheJob(dockerBuildJobNames),
      },
    };

    return defaultWorkflow;
  }

  export enum ClickUpSupportedArchType {
    ARM64 = 'arm64',
    AMD64 = 'amd64',
  }

  export interface BuildPublishOptionsConfig extends OptionalNodeVersion {
    /**
     * List of build architectures for which to build Docker artifacts.
     * @default ARM64
     */
    readonly buildArchitectures?: ClickUpSupportedArchType[];
  }

  function getDockerBuildJobs(
    options: Pick<BuildPublishOptionsConfig, 'buildArchitectures'> &
      Required<Pick<BuildPublishOptionsConfig, 'nodeVersion'>>,
  ) {
    let jobs: Record<string, any> = {};
    const supportedArchTypes = Object.values(ClickUpSupportedArchType);
    const buildArchitectures = options.buildArchitectures ?? [ClickUpSupportedArchType.ARM64];

    if (buildArchitectures.length === 0) {
      throw new Error(
        `No valid ClickUpSupportedArchType selected. Please select at least one of the following: ${supportedArchTypes.join(
          ', ',
        )}`,
      );
    }

    buildArchitectures.map((archType) => {
      jobs = { ...jobs, ...createDockerBuildJob(archType, options.nodeVersion) };
    });

    if (Object.keys(jobs).length === 0) {
      throw new Error('Cannot have a CI workflow without any build jobs!');
    }

    return jobs;
  }

  function createDockerBuildJob(arch: ClickUpSupportedArchType, nodeVersion: string) {
    // Defaults to amd64 configuration
    let selfHostedRunnerType: 'X64' | 'ARM64';
    let dockerArchType: 'arm64v8' | 'amd64';
    const dockerTags: string[] = [`\${{ env.DOCKER_TAG_DRAFT_COMMIT }}-${arch}`];
    switch (arch) {
      case ClickUpSupportedArchType.ARM64:
        selfHostedRunnerType = 'ARM64';
        dockerArchType = 'arm64v8';
        break;
      default: // amd64 condition
        selfHostedRunnerType = 'X64';
        dockerArchType = 'amd64';
        dockerTags.push('${{ env.DOCKER_TAG_DRAFT_COMMIT }}');
    }
    const job = {
      [`docker-build-${arch}`]: {
        name: `Build-${arch}`,
        'runs-on': ['self-hosted', selfHostedRunnerType],
        permissions: {
          contents: 'read',
        },
        outputs: {
          'docker-tag-draft-commit': '${{ env.DOCKER_TAG_DRAFT_COMMIT }}',
          'docker-tag-commit': '${{ env.DOCKER_TAG_COMMIT }}',
          'docker-tag-cur': '${{ env.DOCKER_TAG_CUR }}',
        },
        steps: [
          {
            name: 'Check docker volume utilization',
            run: 'bash -c \'if [[ `df /var/lib/docker --output=pcent | sed 1d | tr -d " %"` > 85 ]]; then docker system prune -af ; else df -h /var/lib/docker | sed 1d; fi\'',
          },
          getCheckoutStep(),
          {
            name: 'Setup NodeJs',
            uses: 'actions/setup-node@5e21ff4d9bc1a8cf6de233a3057d20ec6b3fb69d', // v3.8.1
            with: {
              'node-version': nodeVersion,
            },
          },
          getBuildcacheLoginStep(),
          {
            name: 'Configure NPM',
            run: 'echo "//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}" >> ~/.npmrc',
          },
          {
            uses: 'pnpm/action-setup@d882d12c64e032187b2edb46d3a0d003b7a43598', // 2.4.0
          },
          {
            name: 'Build image',
            uses: DEFAULT_RETRY_ACTION,
            with: {
              max_attempts: 3,
              timeout_minutes: 25,
              command: [
                'bash ./scripts/docker-build.sh \\',
                '${{ inputs.docker-build-args }} \\',
                '--build-arg VERSION="${{ inputs.version }}" \\',
                `--build-arg ARCH=${dockerArchType}`,
                'test -e /tmp/IMAGE_ID || exit 1',
                'echo "DOCKER_IMAGE_ID=$(cat /tmp/IMAGE_ID)" >> $GITHUB_ENV',
              ].join('\n'),
            },
          },
          {
            name: 'Publish image as draft',
            // nrh: CLK-254084: temp fix to stop image creaation proliferation
            if: "startsWith(github.ref, 'refs/heads/')",
            run: [
              ...dockerTags.map(
                (tag) =>
                  `docker tag \${{ env.DOCKER_IMAGE_ID }} "\${{ steps.buildcache.outputs.docker-repo-uri }}:${tag}"`,
              ),
              'docker push --all-tags "${{ steps.buildcache.outputs.docker-repo-uri }}"',
            ].join('\n'),
          },
        ],
      },
    };
    return job;
  }

  function createDockerVulnerabilityScanJob(buildJobNames: string[]) {
    const job = {
      'vulnerability-scan': {
        needs: buildJobNames,
        name: 'Vulnerability Scan',
        // TODO: This only runs on main branch merges for now, so we do not hit the 60/hr cap.
        // FIXME: This shoudl probably start running on all PRs
        if: "${{ github.ref_name == 'main' && !inputs.skip-vulnerability-scan }}",
        'continue-on-error': true, // still experimental, continue if this job fails
        'runs-on': 'ubuntu-latest',
        permissions: {
          contents: 'read',
        },
        steps: [
          getCheckoutStep(),
          {
            name: 'Docker Vulnerability Scan',
            uses: 'time-loop/github-actions/dist/docker-vulnerability-scan@53f03c9bc36389e6b4e671bd8a3cc6286ef37044', // TODO: Do not use prerelease from branch
            id: 'vulnerability-scan',
            with: {
              'buildcache-aws-access-key-id': '${{ secrets.ECR_BUILD_CACHE_AWS_ACCESS_KEY_ID }}',
              'buildcache-aws-secret-access-key': '${{ secrets.ECR_BUILD_CACHE_AWS_SECRET_ACCESS_KEY }}',
              'buildcache-aws-region': '${{ secrets.ECR_BUILD_CACHE_AWS_REGION }}',
              'buildcache-ecr-repo-name': 'monorepo-buildcache',
              'buildcache-pull-tag': '${{ env.DOCKER_TAG_DRAFT_COMMIT }}-arm64', // FIXME:
              'lacework-account-name': '${{ secrets.LW_ACCOUNT_NAME }}',
              'lacework-access-token': '${{ secrets.LW_ACCESS_TOKEN }}',
            },
          },
        ],
      },
    };
    return job;
  }

  function createDockerValidateJob(buildJobNames: string[]) {
    const job = {
      'docker-validate': {
        // nrh: CLK-254084: temp fix to stop image creaation proliferation
        if: "startsWith(github.ref, 'refs/heads/')",
        needs: buildJobNames,
        name: 'Validate',
        strategy: {
          matrix: {
            step: ['healthcheck-verification'],
          },
        },
        'runs-on': 'ubuntu-latest',
        permissions: {
          contents: 'read',
        },
        steps: [
          getCheckoutStep(),
          getBuildcacheLoginStep(),
          {
            name: 'Pull Image',
            uses: 'time-loop/github-actions/dist/docker-ecr-retag-push@53f03c9bc36389e6b4e671bd8a3cc6286ef37044', // TODO: Do not use prerelease from branch
            id: 'buildcache-pull',
            with: {
              'docker-repo-uri': '${{ steps.buildcache.outputs.docker-repo-uri }}',
              'pull-tag': '${{ env.DOCKER_TAG_DRAFT_COMMIT }}-arm64', // FIXME: amd64 hardcoded!
            },
          },
          {
            name: 'healthcheck verification setup (nestjs)',
            if: "matrix.step == 'healthcheck-verification' && inputs.is-nest-app && !inputs.skip-health-check",
            uses: DEFAULT_RETRY_ACTION,
            with: {
              max_attempts: 3,
              timeout_minutes: 2,
              command: [
                'docker-compose --profile localstack up -d',
                'docker run \\',
                '-e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \\',
                '-e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \\',
                '-e DOCKER=true \\',
                '-e TEST_SERVER=true \\',
                '-e CLICKUP_ENV=test \\',
                '-e AWS_REGION=us-west-2 \\',
                '-e AWS_ACCESS_KEY_ID=test \\',
                '-e AWS_SECRET_ACCESS_KEY=test \\',
                '--net=host \\',
                '-d \\',
                '--cidfile /tmp/CONTAINER_ID \\',
                '"${{ steps.buildcache-pull.outputs.pulled-image-id }}" \\',
                'node ./main.js',
              ].join('\n'),
            },
          },
          {
            name: 'healthcheck verification setup (generic)',
            if: "matrix.step == 'healthcheck-verification' && !inputs.is-nest-app && !inputs.skip-health-check",
            run: [
              'docker run \\',
              '-d \\',
              '--cidfile /tmp/CONTAINER_ID \\',
              '"${{ steps.buildcache-pull.outputs.pulled-image-id }}"',
            ].join('\n'),
          },
          {
            name: 'healthcheck verification',
            if: "matrix.step == 'healthcheck-verification' && !inputs.skip-health-check",
            run: [
              'DOCKER_CONTAINER_ID="$(cat /tmp/CONTAINER_ID)"',
              // 40x5 = 200s
              `
for i in {1..40}; do
  sleep 5;
  DOCKER_STATUS=$(docker inspect $DOCKER_CONTAINER_ID --format '{{ .State.Status }}')
  DOCKER_HEALTH=$(docker inspect $DOCKER_CONTAINER_ID --format '{{ .State.Health.Status }}')
  echo "Status: \${DOCKER_STATUS}; Health: \${DOCKER_HEALTH}"
  if [ "\${DOCKER_STATUS}" == "running" ] && [ "\${DOCKER_HEALTH}" == "healthy" ]; then
    echo "Container is running and healthy!" 
    exit 0
  fi
done;`,
              'echo "Failed to get container healthy!"',
              'echo "Docker logs:"',
              'docker logs -n all $DOCKER_CONTAINER_ID',
              'echo "Docker inspect:"',
              'docker inspect $DOCKER_CONTAINER_ID',
              'exit 1',
            ].join('\n'),
          },
        ],
      },
    };
    return job;
  }

  function createDockerPublishToBuildcacheJob(buildJobNames: string[]) {
    const builtArchTypes = buildJobNames.map((jobName) => jobName.split('-').pop());
    const pullImageSteps = builtArchTypes.map((archType) => {
      return {
        name: `Pull Image ${archType}`,
        uses: 'time-loop/github-actions/dist/docker-ecr-retag-push@53f03c9bc36389e6b4e671bd8a3cc6286ef37044', // TODO: Do not use prerelease from branch
        id: `buildcache-pull-${archType}`,
        with: {
          'docker-repo-uri': '${{ steps.buildcache.outputs.docker-repo-uri }}',
          'pull-tag': `\${{ env.DOCKER_TAG_DRAFT_COMMIT }}-${archType}`,
        },
      };
    });
    const job = {
      'docker-publish-buildcache': {
        // nrh: CLK-254084: temp fix to stop image creaation proliferation
        if: "startsWith(github.ref, 'refs/heads/')",
        needs: [...buildJobNames, 'docker-validate'],
        name: 'Publish to Buildcache',
        'runs-on': 'ubuntu-latest',
        steps: [
          getCheckoutStep(),
          getBuildcacheLoginStep(),
          ...pullImageSteps,
          {
            name: 'Tag draft docker image with commit hash',
            run: builtArchTypes
              .map(
                (archType) =>
                  `docker tag "\${{ steps.buildcache-pull-${archType}.outputs.pulled-image-id }}" "\${{ steps.buildcache.outputs.docker-repo-uri }}:\${{ env.DOCKER_TAG_COMMIT }}-${archType}"`,
              )
              .join('\n'),
          },
          {
            name: 'Tag draft image with branch name',
            if: "${{ github.event_name == 'push' }}",
            run: builtArchTypes
              .map(
                (archType) =>
                  `docker tag "\${{ steps.buildcache-pull-${archType}.outputs.pulled-image-id }}" "\${{ steps.buildcache.outputs.docker-repo-uri }}:\${{ env.DOCKER_TAG_CUR }}-${archType}"`,
              )
              .join('\n'),
          },
          {
            name: 'Publish tags',
            run: [
              'docker push --all-tags "${{ steps.buildcache.outputs.docker-repo-uri }}"',
              'docker manifest create "${{ steps.buildcache.outputs.docker-repo-uri }}:${{ env.DOCKER_TAG_DRAFT_COMMIT }}" \\',
              builtArchTypes
                .map(
                  (archType) =>
                    `--amend "\${{ steps.buildcache.outputs.docker-repo-uri }}:\${{ env.DOCKER_TAG_DRAFT_COMMIT }}-${archType}"`,
                )
                .join(' \\\n'),
              'docker manifest push "${{ steps.buildcache.outputs.docker-repo-uri }}:${{ env.DOCKER_TAG_DRAFT_COMMIT }}"',

              'docker manifest create "${{ steps.buildcache.outputs.docker-repo-uri }}:${{ env.DOCKER_TAG_COMMIT }}" \\',
              builtArchTypes
                .map(
                  (archType) =>
                    `--amend "\${{ steps.buildcache.outputs.docker-repo-uri }}:\${{ env.DOCKER_TAG_COMMIT }}-${archType}"`,
                )
                .join(' \\\n'),
              'docker manifest push "${{ steps.buildcache.outputs.docker-repo-uri }}:${{ env.DOCKER_TAG_COMMIT }}"',

              'docker manifest create "${{ steps.buildcache.outputs.docker-repo-uri }}:${{ env.DOCKER_TAG_CUR }}" \\',
              builtArchTypes
                .map(
                  (archType) =>
                    `--amend "\${{ steps.buildcache.outputs.docker-repo-uri }}:\${{ env.DOCKER_TAG_CUR }}-${archType}"`,
                )
                .join(' \\\n'),
              'docker manifest push "${{ steps.buildcache.outputs.docker-repo-uri }}:${{ env.DOCKER_TAG_CUR }}"',
            ].join('\n'),
          },
        ],
      },
    };
    return job;
  }

  export function addBuildPublishWorkflowYml(
    project: clickupEcsService.ClickUpTypeScriptEcsServiceProject,
    options: BuildPublishOptionsConfig,
    override?: any,
  ): void {
    new YamlFile(project, ecsServiceBuildPublishWorkflow.WORKFLOW_LOCATION, {
      obj: { ...createBuildPublishWorkflow({ nodeVersion: project.workflowNodeVersion, ...options }), ...override },
    });
  }
}
