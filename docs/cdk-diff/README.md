# cdk-diff

Get cdk-diff on your repo, you will need to
- edit your `.projenrc.ts`
- run `npx projen` to generate a bunch of files
- edit your `/src/pipeline.ts`

Details follow.

## Edit your .projenrc.ts

```diff
 import { clickupCdk } from '@time-loop/clickup-projen';
 
+const name = 'foo-cdk';
 const project = new clickupCdk.ClickUpCdkTypeScriptApp({
-  name: 'foo-cdk',
-
+  name,
   devDeps: ['@time-loop/clickup-projen'],
   deps: ['@time-loop/cdk-ecs-fargate'],
+
+  cdkDiffOptionsConfig: {
+    envsToDiff: [
+      {
+        name: 'qa',
+        oidcRoleArn: `arn:aws:iam::123412341234:role/${name}-github-actions-role`,
+        labelToApplyWhenNoDiffPresent: 'no-changes-qa',
+        stackSearchString: 'Qa',
+      },
+      {
+        name: 'staging',
+        oidcRoleArn: `arn:aws:iam::432143214321:role/${name}-github-actions-role`,
+        labelToApplyWhenNoDiffPresent: 'no-changes-staging',
+        stackSearchString: 'Staging',
+      },
+      {
+        name: 'prod',
+        oidcRoleArn: `arn:aws:iam::432143214321:role/${name}-github-actions-role`,
+        labelToApplyWhenNoDiffPresent: 'no-changes-prod',
+        stackSearchString: 'Prod',
+      },
+    ],
+    createOidcRoleStack: true,
+  },
```

Get this committed then run `npx projen` to generate the new files.

## Edit your /src/pipeline.ts

Next you need to deploy your OIDC role stacks.
You need to add something like the following to your `/src/pipeline.ts`.
Note the prefix on the `stageId`.
This is to make sure you OIDC stages don't conflict with your service.

```diff
       repoString: `time-loop/${id.addSuffix(['cdk']).kebab}`,
     });
 
+    const oidcPermissions = githubPipeline.addWave('OIDC-GitHub-Actions-Permissions');
+    [core.Environment.usQa, core.Environment.globalProd].forEach((factory) => {
+      const namedEnv = factory('us-east-1');
+      const stageId = cdkPipeline.getUniqueStageIdentifier(namedEnv).addPrefix(['oicd']);
+      oidcPermissions.addStage(
+        GitHubActionsOIDCPermissions.asStage(this, stageId.pascal, { ...commonProps, namedEnv }),
+      );
+    });
+
     const addStage = (factory: core.INamedEnvFactory, addStageProps?: AddStageProps): Stage[] => {
       const targets = addStageProps?.shardsFilter ? factory.getShards(addStageProps.shardsFilter) : factory.shards;
       return targets.map((shard) => {
```

## Total Diff

This is roughly what your PR should end up looking like.
Note that the only files you manually edited were `.projenrc.ts` and `/src/pipeline.ts`.

```
❯ git diff --stat main
 .gitattributes                         |   1 +
 .github/workflows/cdk-diff.yml         | 141 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 .gitignore                             |   1 +
 .projen/deps.json                      |   5 +++
 .projen/files.json                     |   1 +
 .projenrc.ts                           |  28 +++++++++++++--
 package.json                           |   1 +
 renovate.json5                         |   1 +
 src/github-actions-oidc-permissions.ts |  52 ++++++++++++++++++++++++++++
 src/pipeline.ts                        |  10 ++++++
 yarn.lock                              | 116 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
 11 files changed, 354 insertions(+), 3 deletions(-)
```

Understand that when you initially push this, the `cdk-diff` job will fail.
This is expected. It's failing because the OIDC role stacks haven't yet been deployed.
If you have admin access, you can deploy these manually,
but most folks just go ahead and merge the PR.
Then the pipeline will self-mutate and eventually deploy the OIDC role stacks.

Once the pipeline has finished deploying the OIDC role stacks,
find another PR and update it.
You should see the `cdk-diff` stuff succeeding at this point.
