import { Namer } from 'multi-convention-namer';
import { YamlFile } from 'projen';
import { getBuildcacheLoginStep } from './utils/getBuildcacheLoginStep';
import { getCheckoutStep } from './utils/getCheckoutStep';
import { clickupEcsService } from '../clickup-ecs-service';
import { OptionalNodeVersion } from '../optional-node-version';

export module ecsServiceDeployWorkflow {
  export const WORKFLOW_LOCATION = '.github/workflows/ecs-service-deploy.yml';
  export const HARNESS_WORKFLOW_LOCATION = '.github/workflows/harness-deploy.yml';
  function createEcsServiceDeployWorkflow(options: EcsServiceDeployOptionsConfig) {
    const defaultWorkflow = {
      name: 'Deploy Service Image to ECS',

      on: {
        workflow_call: {
          inputs: {
            'service-name': {
              required: true,
              type: 'string',
            },
            version: {
              description: 'The version number that was created for the deploy.',
              required: true,
              type: 'string',
            },
            'harness-account-identifier': {
              description: 'Harness account identifier for Harness pipelines.',
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
        ...createGenerateHarnessWebhookUrlJob(options.deployEnvs),
        ...options.deployEnvs.reduce((prev, env) => {
          return { ...prev, ...createDeployMicroserviceJob(env) };
        }, {}),
      },
    };

    return defaultWorkflow;
  }

  function createEcsServiceHarnessDeployTriggerWorkflow() {
    const startDeployJobName = 'start-deploy';
    const workflow = {
      name: 'Harness Deploy',
      on: {
        workflow_call: {
          inputs: {
            'github-environment': {
              description: 'GitHub environment name that will contain AWS secrets',
              required: true,
              type: 'string',
            },
            'buildcache-ecr-repo-name': {
              description: 'ECR repository name',
              required: true,
              type: 'string',
            },
            'buildcache-pull-tag': {
              description: 'Tag to pull automatically',
              required: false,
              type: 'string',
            },
            'deploy-aws-region': {
              description: 'Amazon region containing the Lambda to deploy a group of services',
              required: true,
              type: 'string',
            },
            'deploy-clickup-env': {
              description: 'The ClickUp environment to deploy to. E.g. "usQa", "globalStaging", "globalProd", etc.',
              required: true,
              type: 'string',
            },
            'deploy-ecr-repo-name': {
              description: 'ECR repository name',
              required: true,
              type: 'string',
            },
            'deploy-push-tags': {
              description: 'Tags to push separated by space',
              required: false,
              type: 'string',
            },
            'deploy-harness-webhook': {
              description: 'The Harness webhook to trigger a deployment',
              default: '',
              required: false,
              type: 'string',
            },
            'deploy-type': {
              description: 'Are we deploying the monolith, or the monorepo? e.g. "monolith" or "monorepo"',
              required: true,
              type: 'string',
            },
            'deploy-service-name': {
              description: 'If deploy-type = monorepo, this should be the micro service name that is being deployed',
              required: false,
              type: 'string',
            },
            version: {
              description: 'The version number that was created for the deploy.',
              required: true,
              type: 'string',
            },
          },
          secrets: {
            'buildcache-aws-access-key-id': {
              description: 'Amazon access key id for build cache user',
              required: true,
            },
            'buildcache-aws-secret-access-key': {
              description: 'Amazon access key for build cache user',
              required: true,
            },
            'buildcache-aws-region': {
              description: 'Amazon region',
              required: true,
            },
            'github-packages-read-token': {
              description: 'A Github personal access token that has read permission for private github packages',
              required: true,
            },
            'ecs-alerts-slack-webhook': {
              description: 'A slack webhook to post alerts on ECS deployment failures',
              required: true,
            },
            'deploy-harness-api-token': {
              description: 'A Harness API token to trigger a deployment',
              required: true,
            },
            'deploy-aws-access-key-id': {
              description: 'Amazon access key id for deploy user',
              required: true,
            },
            'deploy-aws-secret-access-key': {
              description: 'Amazon access key for deploy user',
              required: true,
            },
          },
        },
      },
      jobs: {
        ...createStartDeployJob(startDeployJobName),
        ...createPostDeployJob(startDeployJobName),
      },
    };
    return workflow;
  }

  export enum ClickUpHarnessEnv {
    QA = 'qa',
    STAGING = 'staging',
    PROD = 'prod',
  }

  export enum ClickUpSupportedArchType {
    ARM64 = 'arm64',
    AMD64 = 'amd64',
  }

  export interface EcsServiceDeployOptionsConfig extends OptionalNodeVersion {
    /**
     * List of build architectures for which to build Docker artifacts.
     * @default all
     */
    readonly buildArchitectures?: ClickUpSupportedArchType[];
    /**
     * To which ClickUp environments does your service deploy on release?
     */
    readonly deployEnvs: ClickUpHarnessEnv[];
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function createGenerateHarnessWebhookUrlStep(env: ClickUpHarnessEnv) {
    const envLower = env.toLowerCase();
    const envUpper = env.toUpperCase();
    const envCapital = capitalizeFirstLetter(env);
    const step = {
      name: `Generate ${envCapital} webhook URL`,
      id: envLower,
      run: [
        'export SERVICE_ID=$(echo "${{ inputs.service-name }}" | sed \'s/-/_/g\')',
        `export ${envUpper}_WEBHOOK_URL=$(echo "https://app.harness.io/gateway/pipeline/api/webhook/custom/v2?accountIdentifier=\${ACCOUNT_IDENTIFIER}&orgIdentifier=\${ORG_IDENTIFIER}&projectIdentifier=\${PROJECT_IDENTIFIER}&pipelineIdentifier=${envLower}_\${SERVICE_ID}_deploy&triggerIdentifier=customwebhook_${envLower}_\${SERVICE_ID}")`,
        `echo $${envUpper}_WEBHOOK_URL`,
        `echo "webhook-url=$${envUpper}_WEBHOOK_URL" >> "$GITHUB_OUTPUT"`,
      ].join('\n'),
    };
    return step;
  }

  function createGenerateHarnessWebhookUrlJob(envs: ClickUpHarnessEnv[]) {
    const getOutput = (env: ClickUpHarnessEnv) => {
      return { [`harness-webhook-url-${env}`]: `\${{ steps.${env}.outputs.webhook-url }}` };
    };
    const outputEntries = envs.map((env) => getOutput(env));
    const outputs = outputEntries.reduce((obj, init) => {
      return { ...obj, ...init };
    }, {});
    const steps = envs.map((env) => createGenerateHarnessWebhookUrlStep(env));
    const job = {
      formatting: {
        name: 'Generate Harness Webhook URLs',
        'runs-on': 'ubuntu-latest',
        permissions: {
          contents: 'read',
        },
        env: {
          ACCOUNT_IDENTIFIER: '${{ inputs.harness-account-identifier }}',
          ORG_IDENTIFIER: 'ClickUp',
          PROJECT_IDENTIFIER: 'clickupbackend',
        },
        outputs,
        steps,
      },
    };
    return job;
  }

  function createDeployMicroserviceJob(env: ClickUpHarnessEnv) {
    const harnessEnvToGitHubEnv: Record<ClickUpHarnessEnv, Namer> = {
      [ClickUpHarnessEnv.QA]: new Namer(['us', 'qa']),
      [ClickUpHarnessEnv.STAGING]: new Namer(['global', 'staging']),
      [ClickUpHarnessEnv.PROD]: new Namer(['global', 'prod']),
    };
    const envNamer = harnessEnvToGitHubEnv[env];
    const needs = ['formatting'];
    switch (env) {
      case ClickUpHarnessEnv.PROD:
        needs.push(`docker-deploy-${ClickUpHarnessEnv.QA}`, `docker-deploy-${ClickUpHarnessEnv.STAGING}`);
        break;
      case ClickUpHarnessEnv.STAGING:
        needs.push(`docker-deploy-${ClickUpHarnessEnv.QA}`);
        break;
      default:
    }
    const job = {
      [`docker-deploy-${env}`]: {
        name: `Deploy to ${env}`,
        if: `github.ref == 'refs/heads/main'`,
        needs,
        permissions: {
          contents: 'read',
          actions: 'read',
        },
        concurrency: {
          group: '${{ github.workflow }}-${{ inputs.service-name }}-${{ github.ref_name }}',
        },
        uses: `./${ecsServiceDeployWorkflow.HARNESS_WORKFLOW_LOCATION}`,
        with: {
          'buildcache-ecr-repo-name': 'monorepo-buildcache',
          'buildcache-pull-tag': '${{ needs.docker-build.outputs.docker-tag-draft-commit }}', // FIXME:
          'github-environment': `ecs-deploy-user-${envNamer.parts.join('')}`,
          'deploy-aws-region': 'us-east-1',
          'deploy-clickup-env': envNamer.camel,
          'deploy-type': 'monorepo',
          'deploy-service-name': '${{ inputs.service-name }}',
          'deploy-ecr-repo-name': `monorepo-deploy-${envNamer.kebab}`,
          'deploy-push-tags':
            '${{ needs.docker-build.outputs.docker-tag-cur }} ${{ needs.docker-build.outputs.docker-tag-commit }}', // FIXME:
          // Only pass the harness webhook if the service is in the services list
          'deploy-harness-webhook': `\${{ needs.formatting.outputs.harness-webhook-url-${env} || '' }}`,
          version: '${{ inputs.version }}',
        },
        secrets: {
          'buildcache-aws-access-key-id': '${{ secrets.ECR_BUILD_CACHE_AWS_ACCESS_KEY_ID }}',
          'buildcache-aws-secret-access-key': '${{ secrets.ECR_BUILD_CACHE_AWS_SECRET_ACCESS_KEY }}',
          'buildcache-aws-region': '${{ secrets.ECR_BUILD_CACHE_AWS_REGION }}',
          'github-packages-read-token': '${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
          'ecs-alerts-slack-webhook': '${{ secrets.ECS_ALERTS_SLACK_WEBHOOK }}',
          'deploy-harness-api-token': '${{ secrets.HARNESS_API_TOKEN }}',
          'deploy-aws-access-key-id': '${{ secrets.AWS_ACCESS_KEY_ID }}',
          'deploy-aws-secret-access-key': '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
        },
      },
    };
    return job;
  }

  function getCopyManifestsStep() {
    const step = {
      name: 'Copy Manifest contents',
      id: 'copy-manifest',
      shell: 'bash',
      env: {
        SRC_DOCKER_REPO: '${{ steps.buildcache.outputs.docker-repo-uri }}',
        DST_DOCKER_REPO: '${{ steps.deploy-repo.outputs.docker-repo-uri }}',
      },
      run: [
        'set -ex',
        'export SRC_DOCKER_TAG="${{ inputs.buildcache-pull-tag }}"',
        'export DST_DOCKER_TAGS="${{ inputs.deploy-push-tags }} version-${{ inputs.deploy-service-name && format(\'{0}-\', inputs.deploy-service-name) || "" }}${{ inputs.version || steps.version.outputs.version }}"',
        'SRC_DOCKER_IMAGE="${SRC_DOCKER_REPO}:${SRC_DOCKER_TAG}"',

        'DIGESTS=($(docker manifest inspect "$SRC_DOCKER_IMAGE" | jq -r \'.manifests[].digest\'))',
        `for digest in "\${DIGESTS[@]}"; do
  DST_SHA_DOCKER_TAG=$(echo \${digest} | tr ':' '-')

  docker pull "\${SRC_DOCKER_REPO}@\${digest}"
  docker tag "\${SRC_DOCKER_REPO}@\${digest}" "\${DST_DOCKER_REPO}:\${DST_SHA_DOCKER_TAG}"
done`,
        'docker push "${DST_DOCKER_REPO}" --all-tags',

        `for digest in "\${DIGESTS[@]}"; do
  DST_SHA_DOCKER_TAG=$(echo \${digest} | tr ':' '-')

  for DST_DOCKER_TAG in \${DST_DOCKER_TAGS}; do
    docker manifest create "\${DST_DOCKER_REPO}:\${DST_DOCKER_TAG}" --amend "\${DST_DOCKER_REPO}:\${DST_SHA_DOCKER_TAG}"
  done
done`,

        `for DST_DOCKER_TAG in \${DST_DOCKER_TAGS}; do
  docker manifest push "\${DST_DOCKER_REPO}:\${DST_DOCKER_TAG}"
done`,
        'echo "did-image-push=true" >> $GITHUB_OUTPUT',
      ],
    };
    return step;
  }

  function getHarnessDeployTriggerSteps() {
    const steps = [
      {
        name: 'Harness Deployment Trigger',
        if: '${{ steps.copy-manifest.outputs.did-image-push && inputs.deploy-harness-webhook != "" }}',
        env: {
          docker_tag:
            'version-${{ inputs.deploy-service-name && format(\'{0}-\', inputs.deploy-service-name) || "" }}${{ inputs.version || steps.version.outputs.version }}',
        },
        uses: 'fjogeleit/http-request-action@eab8015483ccea148feff7b1c65f320805ddc2bf', // tag=v1.14.1
        id: 'harness-trigger',
        with: {
          url: '${{ inputs.deploy-harness-webhook }}',
          method: 'POST',
          customHeaders: '{"Content-Type": "application/json", "X-Api-Key": "${{ secrets.deploy-harness-api-token }}"}',
          data: '{"image_tag": "${{ env.docker_tag }}"}',
        },
      },
      {
        name: 'Harness Deployment Response',
        run: "echo '${{ steps.harness-trigger.outputs.response }}' | jq .",
      },
    ];
    return steps;
  }

  function createStartDeployJob(jobId: string) {
    const job = {
      [jobId]: {
        name: 'Start deploy',
        'runs-on': 'ubuntu-latest',
        environment: '${{ inputs.github-environment }}',
        permissions: {
          contents: 'read',
          actions: 'read',
        },
        outputs: {
          'trigger-response': '${{ steps.harness-trigger.outputs.response }}',
        },
        steps: [getCheckoutStep(), getBuildcacheLoginStep(), getCopyManifestsStep(), ...getHarnessDeployTriggerSteps()],
      },
    };
    return job;
  }

  function createPostDeployJob(startDeployJobId: string) {
    const job = {
      'harness-healthchecks': {
        name: 'Post deploy healthchecks',
        'runs-on': 'ubuntu-latest',
        environment: '${{ inputs.github-environment }}',
        needs: [startDeployJobId],
        if: '${{ (success() || failure()) && needs.start-deploy.outputs.trigger-response }}',
        permissions: {
          contents: 'read',
          actions: 'read',
        },
        steps: [
          getCheckoutStep(),
          {
            name: 'Get Harness Pipeline Execution URL',
            shell: 'bash',
            run: `echo \${{ fromJSON(needs.${startDeployJobId}.outputs.trigger-response).data.uiUrl }}`,
          },
          {
            name: 'Get Harness Pipeline Status',
            if: "${{ inputs.deploy-harness-webhook != '' }}",
            id: 'harness-pipeline-wait',
            uses: './.github/actions/harness-pipeline-wait', // FIXME: Move to github-actions.yml maybe,
            with: {
              'harness-api-token': '${{ secrets.deploy-harness-api-token }}',
              'harness-execution-url': `\${{ fromJSON(needs.${startDeployJobId}.outputs.trigger-response).data.apiUrl }}`,
            },
          },
        ],
      },
    };
    return job;
  }

  export function addEcsServiceDeployWorkflowYml(
    project: clickupEcsService.ClickUpTypeScriptEcsServiceProject,
    options: EcsServiceDeployOptionsConfig,
    override?: any,
  ): void {
    new YamlFile(project, ecsServiceDeployWorkflow.HARNESS_WORKFLOW_LOCATION, {
      obj: { ...createEcsServiceHarnessDeployTriggerWorkflow() },
    });
    new YamlFile(project, ecsServiceDeployWorkflow.WORKFLOW_LOCATION, {
      obj: { ...createEcsServiceDeployWorkflow({ nodeVersion: project.workflowNodeVersion, ...options }), ...override },
    });
  }
}
