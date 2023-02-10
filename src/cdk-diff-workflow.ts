import { typescript, YamlFile } from 'projen';
import { NodePackage } from 'projen/lib/javascript';

export module cdkDiffWorkflow {
  function createCdkDiffWorkflow(options: CDKDiffOptionsConfig) {
    const defaultWorkflow = {
      name: 'cdk-diff',
      on: {
        pull_request: {},
        workflow_dispatch: {},
      },
      permissions: {
        'id-token': 'write',
        contents: 'write',
        'pull-requests': 'write',
      },
      jobs: {
        diff: {
          'runs-on': 'ubuntu-latest',
          env: {
            CI: 'true',
            GITHUB_PR_NUMBER: '${{github.event.pull_request.number}}',
            REPO_NAME: '${{ github.event.repository.name }}',
          },
          steps: [
            {
              name: 'Checkout',
              uses: 'actions/checkout@v3',
              with: {
                ref: '${{ github.event.pull_request.head.ref }}',
                repository: '${{ github.event.pull_request.head.repo.full_name }}',
              },
            },
            {
              name: 'GitHub Packages authorization',
              run: 'cat > .npmrc <<EOF\n//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}\n@time-loop:registry=https://npm.pkg.github.com/\nEOF',
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v3',
              with: {
                'node-version': '14.x',
              },
            },
            {
              name: 'Install dependencies',
              run: 'yarn install --check-files',
            },
            {
              name: 'ls stacks in each env',
              run: './node_modules/.bin/cdk ls -l -j > cdk-ls.json\nQA_STACKS=$(jq -r \'[.[].id | select(contains("Qa")) ] | join(" ")\' cdk-ls.json)\nSTG_STACKS=$(jq -r \'[.[].id | select(contains("Staging")) ] | join(" ")\' cdk-ls.json)\nPROD_STACKS=$(jq -r \'[.[].id | select(contains("Prod")) ] | join(" ")\' cdk-ls.json)\necho "QA_STACKS=$QA_STACKS" >> $GITHUB_ENV\necho "STG_STACKS=$STG_STACKS" >> $GITHUB_ENV\necho "PROD_STACKS=$PROD_STACKS" >> $GITHUB_ENV\n',
            },
            {
              name: 'configure qa aws credentials',
              uses: 'aws-actions/configure-aws-credentials@v1',
              with: {
                'role-to-assume': options.oidcQaRoleArn,
                'role-duration-seconds': 900,
                'aws-region': 'us-west-2',
              },
            },
            {
              name: 'diff qa',
              run: "set -o pipefail\n./node_modules/.bin/cdk diff $QA_STACKS --progress=events --staging false -e --ignore-errors --version-reporting false &> >(tee cdk-qa.log)\n./node_modules/.bin/ts-node ./node_modules/@time-loop/cdk-log-parser/src/cdkLogParser.ts cdk-qa.log && echo 'QA_HAS_NO_DIFF=true' >> $GITHUB_ENV\n",
            },
            {
              name: 'configure staging aws credentials',
              uses: 'aws-actions/configure-aws-credentials@v1',
              with: {
                'role-to-assume': options.oidcStagingRoleArn,
                'role-duration-seconds': 900,
                'aws-region': 'us-west-2',
              },
            },
            {
              name: 'diff staging',
              run: "set -o pipefail\n./node_modules/.bin/cdk diff $STG_STACKS --progress=events --staging false -e --ignore-errors --version-reporting false &> >(tee cdk-staging.log)\n./node_modules/.bin/ts-node ./node_modules/@time-loop/cdk-log-parser/src/cdkLogParser.ts cdk-staging.log && echo 'STAGING_HAS_NO_DIFF=true' >> $GITHUB_ENV\n",
            },
            {
              name: 'configure prod aws credentials',
              uses: 'aws-actions/configure-aws-credentials@v1',
              with: {
                'role-to-assume': options.oidcProdRoleArn,
                'role-duration-seconds': 900,
                'aws-region': 'us-west-2',
              },
            },
            {
              name: 'diff prod',
              run: "set -o pipefail\n./node_modules/.bin/cdk diff $PROD_STACKS --progress=events --staging false -e --ignore-errors --version-reporting false &> >(tee cdk-prod.log)\n./node_modules/.bin/ts-node ./node_modules/@time-loop/cdk-log-parser/src/cdkLogParser.ts cdk-prod.log && echo 'PROD_HAS_NO_DIFF=true' >> $GITHUB_ENV\n",
            },
            {
              name: 'cdk-notify',
              run: "curl -L \"https://github.com/karlderkaefer/cdk-notifier/releases/download/v2.3.2/cdk-notifier_$(uname)_amd64.gz\" -o cdk-notifier.gz\ngunzip cdk-notifier.gz && chmod +x cdk-notifier && rm -rf cdk-notifier.gz\n./cdk-notifier --log-file ./cdk-qa.log --repo $REPO_NAME --owner $GITHUB_REPOSITORY_OWNER --token ${{ secrets.GITHUB_TOKEN }} --pull-request-id ${{ github.event.pull_request.number }} -t 'Qa Stacks'\n./cdk-notifier --log-file ./cdk-staging.log --repo $REPO_NAME --owner $GITHUB_REPOSITORY_OWNER --token ${{ secrets.GITHUB_TOKEN }} --pull-request-id ${{ github.event.pull_request.number }} -t 'Staging Stacks'\n./cdk-notifier --log-file ./cdk-prod.log --repo $REPO_NAME --owner $GITHUB_REPOSITORY_OWNER --token ${{ secrets.GITHUB_TOKEN }} --pull-request-id ${{ github.event.pull_request.number }} -t 'Production Stacks'\n",
            },
            {
              name: 'Apply qa has no diff label based on diff status',
              if: "env.QA_HAS_NO_DIFF == 'true'",
              uses: 'actions/github-script@v6',
              with: {
                'github-token': '${{ secrets.GITHUB_TOKEN }}',
                script:
                  'github.rest.issues.addLabels({\n  issue_number: context.issue.number,\n  owner: context.repo.owner,\n  repo: context.repo.repo,\n  labels: ["no-qa-changes"]\n})\n',
              },
            },
            {
              name: 'Apply staging has no diff label based on diff status',
              if: "env.STAGING_HAS_NO_DIFF == 'true'",
              uses: 'actions/github-script@v6',
              with: {
                'github-token': '${{ secrets.GITHUB_TOKEN }}',
                script:
                  'github.rest.issues.addLabels({\n  issue_number: context.issue.number,\n  owner: context.repo.owner,\n  repo: context.repo.repo,\n  labels: ["no-staging-changes"]\n})\n',
              },
            },
            {
              name: 'Apply prod has no diff label based on diff status',
              if: "env.PROD_HAS_NO_DIFF == 'true'",
              uses: 'actions/github-script@v6',
              with: {
                'github-token': '${{ secrets.GITHUB_TOKEN }}',
                script:
                  'github.rest.issues.addLabels({\n  issue_number: context.issue.number,\n  owner: context.repo.owner,\n  repo: context.repo.repo,\n  labels: ["no-prod-changes"]\n})\n',
              },
            },
            {
              name: 'Should auto merge',
              id: 'should-auto-merge',
              if: "env.QA_HAS_NO_DIFF == 'true' && env.STAGING_HAS_NO_DIFF == 'true' && env.PROD_HAS_NO_DIFF == 'true' && github.event.pull_request.user.login == 'cu-infra-svc-git'",
              run: 'echo "auto-merge=true" >> $GITHUB_OUTPUT',
            },
            {
              name: 'Enable automerge',
              uses: 'daneden/enable-automerge-action@v1.0.2',
              if: 'steps.should-auto-merge.outputs.auto-merge',
              with: {
                'github-token': '${{ secrets.PROJEN_GITHUB_TOKEN }}',
                'merge-method': 'SQUASH',
                'allowed-author': 'cu-infra-svc-git',
              },
            },
            {
              name: 'Auto approve',
              uses: 'hmarr/auto-approve-action@v2.2.1',
              if: 'steps.should-auto-merge.outputs.auto-merge',
              with: {
                'github-token': '${{ secrets.GITHUB_TOKEN }}',
              },
            },
          ],
        },
      },
    };

    return defaultWorkflow;
  }

  export interface CDKDiffOptionsConfig {
    /**
     * Name of the QA OIDC role name which contains neccesasry IAM policies to run the CDK diff
     *
     * Example arn: `arn:aws:iam::123123123123:role/squad-github-actions-permissions-squad-cdk-github-actions-role`
     */
    readonly oidcQaRoleArn: string;

    /**
     * Name of the Staging OIDC role name which contains neccesasry IAM policies to run the CDK diff
     *
     * Example arn: `arn:aws:iam::123123123123:role/squad-github-actions-permissions-squad-cdk-github-actions-role`
     */
    readonly oidcStagingRoleArn: string;

    /**
     * Name of the Prod OIDC role name which contains neccesasry IAM policies to run the CDK diff
     *
     * Example arn: `arn:aws:iam::123123123123:role/squad-github-actions-permissions-squad-cdk-github-actions-role`
     */
    readonly oidcProdRoleArn: string;
  }

  export function getCDKDiffOptions(options?: CDKDiffOptionsConfig) {
    return options;
  }

  export function addCdkDiffWorkflowYml(
    project: typescript.TypeScriptProject,
    options: CDKDiffOptionsConfig,
    override?: any,
  ): void {
    new YamlFile(project, '.github/workflows/cdk-diff.yml', {
      obj: { ...createCdkDiffWorkflow(options), ...override },
    });
  }

  export function AddCdkLogParserDependency(pkg: NodePackage) {
    pkg.addDevDeps('@time-loop/cdk-log-parser@0.0.0');
  }
}
