# cdk-context-json

## Edit your .projenrc.ts

```diff
@@ -7,23 +8,30 @@ const project = new clickupCdk.ClickUpCdkTypeScriptApp({
   defaultReleaseBranch: 'main',
   projenrcTs: true,
 
+  cdkContextJsonOptions: {
+    injectionOptions: {
+      lookupAccountId: core.Environment.usCdkPipelines.account,
+    },
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
+    const stageId = cdkPipeline.getUniqueStageIdentifier(cdkPipelinesVa).addPrefix(['oicd']);
+    oidcPermissions.addStage(
+      GitHubActionsOIDCCdkContextLookupRole.asStage(this, stageId.pascal, {...commonProps, namedEnv: cdkPipelinesVa})
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
