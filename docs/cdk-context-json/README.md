# cdk-context-json

The context lookup function workflow updates the `cdk.context.json` file by adding missing shard config automatically instead of manual update. However, if the build or the UTs fail then this workflow will not update the `cdk.context.json` for the missing shard config. The errors resulting in the build/unit test failures shall be addressed in order for this workflow to succeed and this is the default behaviour of this workflow(see this Ref PR with the mentioned default behaviour: https://github.com/time-loop/core-cdk/pull/251).

## Edit your .projenrc.ts

DO NOT just add the `injectionOptions` stuff from step 2.
You need to get this merged and the OIDC role deployed first.

```diff
@@ -7,23 +8,30 @@ const project = new clickupCdk.ClickUpCdkTypeScriptApp({
   defaultReleaseBranch: 'main',
   projenrcTs: true,
 
+  cdkContextJsonOptions: {
+    createOidcRoleStack: true,
+  },
+
   cdkDiffOptionsConfig: {
     envsToDiff: [
       {
```

Get this committed then run `npx projen` to generate the new files.

## Edit your /src/pipeline.ts

Next you need to deploy your OIDC role stack.
This only gets deployed once and only gets deployed into the `usCdkPipelines` account.

```diff
diff --git a/src/pipeline.ts b/src/pipeline.ts
index aa0d831..d4b75b6 100644
--- a/src/pipeline.ts
+++ b/src/pipeline.ts
@@ -3,6 +3,7 @@ import { Stage, pipelines } from 'aws-cdk-lib';
 import { Construct } from 'constructs';
 
 import { GitHubActionsOIDCPermissions } from './github-actions-oidc-permissions';
+import { GitHubActionsOIDCCdkContextLookupRole } from './github-actions-oidc-cdk-context-lookup-role';
 import { name } from './helpers';
 import { DbStage } from './stage';
 
@@ -47,7 +48,19 @@ export class PipelineStack extends core.AccountLevelStack {
     });
 
     const oidcPermissions = githubPipeline.addWave('OIDC-GitHub-Actions-Permissions');
+
+    // cdk.context.json lookup support role
+    const cdkPipelinesVa = core.Environment.usCdkPipelines('us-east-1');
+    const vaStageId = cdkPipeline.getUniqueStageIdentifier(cdkPipelinesVa).addPrefix(['oicd']);
+    oidcPermissions.addStage(
+      GitHubActionsOIDCCdkContextLookupRole.asStage(this, vaStageId.pascal, {...commonProps, namedEnv: cdkPipelinesVa})
+    )
+
     // cdk-diff support roles
```

## Get your PR merged and role deployed

You must get your PR with the above merged and the role deployed before going further,
or your build will break.

## Edit your .projenrc.ts a second time

This will inject the `configure-aws-credentials` step into your build workflows.
**THIS WILL BREAK YOUR build WORKFLOW UNLESS YOU HAVE THE OIDC ROLE DEPLOYED**

```diff
@@ -7,23 +8,30 @@ const project = new clickupCdk.ClickUpCdkTypeScriptApp({
   cdkContextJsonOptions: {
+    injectionOptions: {
+      lookupAccountId: core.Environment.usCdkPipelines.account,
+    },
     createOidcRoleStack: true,
   },
```
