# codecov-bypass

This is currently an explict opt-in feature. Eventually it will be a default enabled workflow with an explicit disable.

To add this to your project, you will need to

- edit your `.projenrc.ts`
- run `npx projen` to generate a bunch of files
- update your branch protection rules

## Edit your .projenrc.ts

```diff
 import { clickupCdk } from '@time-loop/clickup-projen';
 const project = new clickupCdk.ClickUpCdkTypeScriptApp({
   ...
+  codecovBypassOptionsConfig: {
+   githubAppId: '${{ vars.CODECOV_GITHUB_APP_ID }}',
+   githubAppPrivateKey: '${{ secrets.CODECOV_GITHUB_APP_PRIVATE_KEY }}'
+  },
```

## Generate new files

After the above change, run `npx projen` to generate the new files.

## Update Branch Protection Rules

Once the above changes are merged, you will need to update your branch protection rules:

1. Remove `codecod/patch`, and `codecov/patch` from the list of required checks.
2. Add `Code coverage increased` to the list of required checks.
