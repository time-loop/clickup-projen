# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### ClickUpCdkTypeScriptAppOptions <a name="ClickUpCdkTypeScriptAppOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions"></a>

If only JSII supported Omit<>.

#### Initializer <a name="Initializer" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.Initializer"></a>

```typescript
import { clickupCdk } from '@time-loop/clickup-projen'

const clickUpCdkTypeScriptAppOptions: clickupCdk.ClickUpCdkTypeScriptAppOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.name">name</a></code> | <code>string</code> | This is the name of your project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.logging">logging</a></code> | <code>projen.LoggerOptions</code> | Configure logging options such as verbosity. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.outdir">outdir</a></code> | <code>string</code> | The root directory of the project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.parent">parent</a></code> | <code>projen.Project</code> | The parent project, if this project is part of a bigger project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenCommand">projenCommand</a></code> | <code>string</code> | The shell command to use in order to run the projen CLI. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJson">projenrcJson</a></code> | <code>boolean</code> | Generate (once) .projenrc.json (in JSON). Set to `false` in order to disable .projenrc.json generation. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJsonOptions">projenrcJsonOptions</a></code> | <code>projen.ProjenrcOptions</code> | Options for .projenrc.json. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoApproveOptions">autoApproveOptions</a></code> | <code>projen.github.AutoApproveOptions</code> | Enable and configure the 'auto approve' workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoMergeOptions">autoMergeOptions</a></code> | <code>projen.github.AutoMergeOptions</code> | Configure options for automatic merging on GitHub. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.clobber">clobber</a></code> | <code>boolean</code> | Add a `clobber` task which resets the repo to origin. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.devContainer">devContainer</a></code> | <code>boolean</code> | Add a VSCode development environment (used for GitHub Codespaces). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.github">github</a></code> | <code>boolean</code> | Enable GitHub integration. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.githubOptions">githubOptions</a></code> | <code>projen.github.GitHubOptions</code> | Options for GitHub integration. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.gitpod">gitpod</a></code> | <code>boolean</code> | Add a Gitpod development environment. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.mergify">mergify</a></code> | <code>boolean</code> | Whether mergify should be enabled on this repository or not. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.mergifyOptions">mergifyOptions</a></code> | <code>projen.github.MergifyOptions</code> | Options for mergify. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projectType">projectType</a></code> | <code>projen.ProjectType</code> | Which type of project this is (library/app). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenTokenSecret">projenTokenSecret</a></code> | <code>string</code> | The name of a secret which includes a GitHub Personal Access Token to be used by projen workflows. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.readme">readme</a></code> | <code>projen.SampleReadmeProps</code> | The README setup. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.stale">stale</a></code> | <code>boolean</code> | Auto-close of stale issues and pull request. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.staleOptions">staleOptions</a></code> | <code>projen.github.StaleOptions</code> | Auto-close stale issues and pull requests. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.vscode">vscode</a></code> | <code>boolean</code> | Enable VSCode integration. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.allowLibraryDependencies">allowLibraryDependencies</a></code> | <code>boolean</code> | Allow the project to include `peerDependencies` and `bundledDependencies`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorEmail">authorEmail</a></code> | <code>string</code> | Author's e-mail. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorName">authorName</a></code> | <code>string</code> | Author's name. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorOrganization">authorOrganization</a></code> | <code>boolean</code> | Author's Organization. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorUrl">authorUrl</a></code> | <code>string</code> | Author's URL / Website. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoDetectBin">autoDetectBin</a></code> | <code>boolean</code> | Automatically add all executables under the `bin` directory to your `package.json` file under the `bin` section. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bin">bin</a></code> | <code>{[ key: string ]: string}</code> | Binary programs vended with your module. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bugsEmail">bugsEmail</a></code> | <code>string</code> | The email address to which issues should be reported. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bugsUrl">bugsUrl</a></code> | <code>string</code> | The url to your project's issue tracker. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bundledDeps">bundledDeps</a></code> | <code>string[]</code> | List of dependencies to bundle into this module. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.codeArtifactOptions">codeArtifactOptions</a></code> | <code>projen.javascript.CodeArtifactOptions</code> | Options for publishing npm package to AWS CodeArtifact. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.deps">deps</a></code> | <code>string[]</code> | Runtime dependencies of this module. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.description">description</a></code> | <code>string</code> | The description is just a string that helps people understand the purpose of the package. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.devDeps">devDeps</a></code> | <code>string[]</code> | Build dependencies for this module. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.entrypoint">entrypoint</a></code> | <code>string</code> | Module entrypoint (`main` in `package.json`). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.homepage">homepage</a></code> | <code>string</code> | Package's Homepage / Website. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.keywords">keywords</a></code> | <code>string[]</code> | Keywords to include in `package.json`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.license">license</a></code> | <code>string</code> | License's SPDX identifier. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.licensed">licensed</a></code> | <code>boolean</code> | Indicates if a license should be added. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.maxNodeVersion">maxNodeVersion</a></code> | <code>string</code> | Minimum node.js version to require via `engines` (inclusive). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.minNodeVersion">minNodeVersion</a></code> | <code>string</code> | Minimum Node.js version to require via package.json `engines` (inclusive). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmAccess">npmAccess</a></code> | <code>projen.javascript.NpmAccess</code> | Access level of the npm package. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmRegistry">npmRegistry</a></code> | <code>string</code> | The host name of the npm registry to publish to. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmRegistryUrl">npmRegistryUrl</a></code> | <code>string</code> | The base URL of the npm package registry. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmTokenSecret">npmTokenSecret</a></code> | <code>string</code> | GitHub secret which contains the NPM token to use when publishing packages. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.packageManager">packageManager</a></code> | <code>projen.javascript.NodePackageManager</code> | The Node Package Manager used to execute scripts. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.packageName">packageName</a></code> | <code>string</code> | The "name" in package.json. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.peerDependencyOptions">peerDependencyOptions</a></code> | <code>projen.javascript.PeerDependencyOptions</code> | Options for `peerDeps`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.peerDeps">peerDeps</a></code> | <code>string[]</code> | Peer dependencies for this module. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.repository">repository</a></code> | <code>string</code> | The repository is the location where the actual code for your package lives. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.repositoryDirectory">repositoryDirectory</a></code> | <code>string</code> | If the package.json for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.scripts">scripts</a></code> | <code>{[ key: string ]: string}</code> | npm scripts to include. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.stability">stability</a></code> | <code>string</code> | Package's Stability. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.jsiiReleaseVersion">jsiiReleaseVersion</a></code> | <code>string</code> | Version requirement of `publib` which is used to publish modules to npm. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.majorVersion">majorVersion</a></code> | <code>number</code> | Major version to release from the default branch. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmDistTag">npmDistTag</a></code> | <code>string</code> | The npmDistTag to use when publishing from the default branch. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.postBuildSteps">postBuildSteps</a></code> | <code>projen.github.workflows.JobStep[]</code> | Steps to execute after build as part of the release workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.prerelease">prerelease</a></code> | <code>string</code> | Bump versions from the default branch as pre-releases (e.g. "beta", "alpha", "pre"). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.publishDryRun">publishDryRun</a></code> | <code>boolean</code> | Instead of actually publishing to package managers, just print the publishing command. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.publishTasks">publishTasks</a></code> | <code>boolean</code> | Define publishing tasks that can be executed manually as well as workflows. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseBranches">releaseBranches</a></code> | <code>{[ key: string ]: projen.release.BranchOptions}</code> | Defines additional release branches. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseEveryCommit">releaseEveryCommit</a></code> | <code>boolean</code> | Automatically release new versions every commit to one of branches in `releaseBranches`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseFailureIssue">releaseFailureIssue</a></code> | <code>boolean</code> | Create a github issue on every failed publishing task. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseFailureIssueLabel">releaseFailureIssueLabel</a></code> | <code>string</code> | The label to apply to issues indicating publish failures. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseSchedule">releaseSchedule</a></code> | <code>string</code> | CRON schedule to trigger new releases. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseTagPrefix">releaseTagPrefix</a></code> | <code>string</code> | Automatically add the given prefix to release tags. Useful if you are releasing on multiple branches with overlapping version numbers. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseTrigger">releaseTrigger</a></code> | <code>projen.release.ReleaseTrigger</code> | The release trigger to use. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseWorkflowName">releaseWorkflowName</a></code> | <code>string</code> | The name of the default release workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseWorkflowSetupSteps">releaseWorkflowSetupSteps</a></code> | <code>projen.github.workflows.JobStep[]</code> | A set of workflow steps to execute in order to setup the workflow container. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.versionrcOptions">versionrcOptions</a></code> | <code>{[ key: string ]: any}</code> | Custom configuration used when creating changelog with standard-version package. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowContainerImage">workflowContainerImage</a></code> | <code>string</code> | Container image to use for GitHub workflows. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowRunsOn">workflowRunsOn</a></code> | <code>string[]</code> | Github Runner selection labels. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.defaultReleaseBranch">defaultReleaseBranch</a></code> | <code>string</code> | The name of the main release branch. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.artifactsDirectory">artifactsDirectory</a></code> | <code>string</code> | A directory which will contain build artifacts. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoApproveProjenUpgrades">autoApproveProjenUpgrades</a></code> | <code>boolean</code> | Automatically approve projen upgrade PRs, allowing them to be merged by mergify (if configued). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoApproveUpgrades">autoApproveUpgrades</a></code> | <code>boolean</code> | Automatically approve deps upgrade PRs, allowing them to be merged by mergify (if configued). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.buildWorkflow">buildWorkflow</a></code> | <code>boolean</code> | Define a GitHub workflow for building PRs. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.buildWorkflowTriggers">buildWorkflowTriggers</a></code> | <code>projen.github.workflows.Triggers</code> | Build workflow triggers. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bundlerOptions">bundlerOptions</a></code> | <code>projen.javascript.BundlerOptions</code> | Options for `Bundler`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.codeCov">codeCov</a></code> | <code>boolean</code> | Define a GitHub workflow step for sending code coverage metrics to https://codecov.io/ Uses codecov/codecov-action@v1 A secret is required for private repos. Configured with @codeCovTokenSecret. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.codeCovTokenSecret">codeCovTokenSecret</a></code> | <code>string</code> | Define the secret name for a specified https://codecov.io/ token A secret is required to send coverage for private repositories. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.copyrightOwner">copyrightOwner</a></code> | <code>string</code> | License copyright owner. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.copyrightPeriod">copyrightPeriod</a></code> | <code>string</code> | The copyright years to put in the LICENSE file. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.dependabot">dependabot</a></code> | <code>boolean</code> | Use dependabot to handle dependency upgrades. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.dependabotOptions">dependabotOptions</a></code> | <code>projen.github.DependabotOptions</code> | Options for dependabot. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.depsUpgrade">depsUpgrade</a></code> | <code>boolean</code> | Use github workflows to handle dependency upgrades. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.depsUpgradeOptions">depsUpgradeOptions</a></code> | <code>projen.javascript.UpgradeDependenciesOptions</code> | Options for depsUpgrade. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.gitignore">gitignore</a></code> | <code>string[]</code> | Additional entries to .gitignore. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.jest">jest</a></code> | <code>boolean</code> | Setup jest unit tests. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.jestOptions">jestOptions</a></code> | <code>projen.javascript.JestOptions</code> | Jest options. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.mutableBuild">mutableBuild</a></code> | <code>boolean</code> | Automatically update files modified during builds to pull-request branches. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmignore">npmignore</a></code> | <code>string[]</code> | Additional entries to .npmignore. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmignoreEnabled">npmignoreEnabled</a></code> | <code>boolean</code> | Defines an .npmignore file. Normally this is only needed for libraries that are packaged as tarballs. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.package">package</a></code> | <code>boolean</code> | Defines a `package` task that will produce an npm tarball under the artifacts directory (e.g. `dist`). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.prettier">prettier</a></code> | <code>boolean</code> | Setup prettier. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.prettierOptions">prettierOptions</a></code> | <code>projen.javascript.PrettierOptions</code> | Prettier options. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenDevDependency">projenDevDependency</a></code> | <code>boolean</code> | Indicates of "projen" should be installed as a devDependency. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJs">projenrcJs</a></code> | <code>boolean</code> | Generate (once) .projenrc.js (in JavaScript). Set to `false` in order to disable .projenrc.js generation. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJsOptions">projenrcJsOptions</a></code> | <code>projen.javascript.ProjenrcOptions</code> | Options for .projenrc.js. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenUpgradeAutoMerge">projenUpgradeAutoMerge</a></code> | <code>boolean</code> | Automatically approve projen upgrade PRs, allowing them to be merged by mergify (if configued). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenUpgradeSchedule">projenUpgradeSchedule</a></code> | <code>string[]</code> | Customize the projenUpgrade schedule in cron expression. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenUpgradeSecret">projenUpgradeSecret</a></code> | <code>string</code> | Periodically submits a pull request for projen upgrades (executes `yarn projen:upgrade`). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenVersion">projenVersion</a></code> | <code>string</code> | Version of projen to install. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.pullRequestTemplate">pullRequestTemplate</a></code> | <code>boolean</code> | Include a GitHub pull request template. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.pullRequestTemplateContents">pullRequestTemplateContents</a></code> | <code>string[]</code> | The contents of the pull request template. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.release">release</a></code> | <code>boolean</code> | Add release management to this project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseToNpm">releaseToNpm</a></code> | <code>boolean</code> | Automatically release to npm when new versions are introduced. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseWorkflow">releaseWorkflow</a></code> | <code>boolean</code> | DEPRECATED: renamed to `release`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowBootstrapSteps">workflowBootstrapSteps</a></code> | <code>any[]</code> | Workflow steps to use in order to bootstrap this repo. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowGitIdentity">workflowGitIdentity</a></code> | <code>projen.github.GitIdentity</code> | The git identity to use in workflows. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowNodeVersion">workflowNodeVersion</a></code> | <code>string</code> | The node version to use in GitHub workflows. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.disableTsconfig">disableTsconfig</a></code> | <code>boolean</code> | Do not generate a `tsconfig.json` file (used by jsii projects since tsconfig.json is generated by the jsii compiler). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.docgen">docgen</a></code> | <code>boolean</code> | Docgen by Typedoc. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.docsDirectory">docsDirectory</a></code> | <code>string</code> | Docs directory. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.entrypointTypes">entrypointTypes</a></code> | <code>string</code> | The .d.ts file that includes the type declarations for this module. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.eslint">eslint</a></code> | <code>boolean</code> | Setup eslint. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.eslintOptions">eslintOptions</a></code> | <code>projen.javascript.EslintOptions</code> | Eslint options. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.libdir">libdir</a></code> | <code>string</code> | Typescript  artifacts output directory. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcTs">projenrcTs</a></code> | <code>boolean</code> | Use TypeScript for your projenrc file (`.projenrc.ts`). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcTsOptions">projenrcTsOptions</a></code> | <code>projen.typescript.ProjenrcOptions</code> | Options for .projenrc.ts. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.sampleCode">sampleCode</a></code> | <code>boolean</code> | Generate one-time sample in `src/` and `test/` if there are no files there. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.srcdir">srcdir</a></code> | <code>string</code> | Typescript sources directory. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.testdir">testdir</a></code> | <code>string</code> | Jest tests directory. Tests files should be named `xxx.test.ts`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.tsconfig">tsconfig</a></code> | <code>projen.javascript.TypescriptConfigOptions</code> | Custom TSConfig. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.tsconfigDev">tsconfigDev</a></code> | <code>projen.javascript.TypescriptConfigOptions</code> | Custom tsconfig options for the development tsconfig.json file (used for testing). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.tsconfigDevFile">tsconfigDevFile</a></code> | <code>string</code> | The name of the development tsconfig.json file. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.typescriptVersion">typescriptVersion</a></code> | <code>string</code> | TypeScript version to use. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.buildCommand">buildCommand</a></code> | <code>string</code> | A command to execute before synthesis. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkout">cdkout</a></code> | <code>string</code> | cdk.out directory. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.context">context</a></code> | <code>{[ key: string ]: any}</code> | Additional context to include in `cdk.json`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.featureFlags">featureFlags</a></code> | <code>boolean</code> | Include all feature flags in cdk.json. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.requireApproval">requireApproval</a></code> | <code>projen.awscdk.ApprovalLevel</code> | To protect you against unintended changes that affect your security posture, the AWS CDK Toolkit prompts you to approve security-related changes before deploying them. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.watchExcludes">watchExcludes</a></code> | <code>string[]</code> | Glob patterns to exclude from `cdk watch`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.watchIncludes">watchIncludes</a></code> | <code>string[]</code> | Glob patterns to include in `cdk watch`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkVersion">cdkVersion</a></code> | <code>string</code> | Minimum version of the AWS CDK to depend on. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkAssert">cdkAssert</a></code> | <code>boolean</code> | Warning: NodeJS only. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkAssertions">cdkAssertions</a></code> | <code>boolean</code> | Install the assertions library? |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkDependencies">cdkDependencies</a></code> | <code>string[]</code> | Which AWS CDKv1 modules this project requires. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkDependenciesAsDeps">cdkDependenciesAsDeps</a></code> | <code>boolean</code> | If this is enabled (default), all modules declared in `cdkDependencies` will be also added as normal `dependencies` (as well as `peerDependencies`). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkTestDependencies">cdkTestDependencies</a></code> | <code>string[]</code> | AWS CDK modules required for testing. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkVersionPinning">cdkVersionPinning</a></code> | <code>boolean</code> | Use pinned version instead of caret version for CDK. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.constructsVersion">constructsVersion</a></code> | <code>string</code> | Minimum version of the `constructs` library to depend on. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.appEntrypoint">appEntrypoint</a></code> | <code>string</code> | The CDK app's entrypoint (relative to the source directory, which is "src" by default). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.integrationTestAutoDiscover">integrationTestAutoDiscover</a></code> | <code>boolean</code> | Automatically discovers and creates integration tests for each `.integ.ts` file in under your test directory. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.lambdaAutoDiscover">lambdaAutoDiscover</a></code> | <code>boolean</code> | Automatically adds an `awscdk.LambdaFunction` for each `.lambda.ts` handler in your source tree. If this is disabled, you can manually add an `awscdk.AutoDiscover` component to your project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.lambdaOptions">lambdaOptions</a></code> | <code>projen.awscdk.LambdaFunctionCommonOptions</code> | Common options for all AWS Lambda functions. |

---

##### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* $BASEDIR

This is the name of your project.

---

##### `logging`<sup>Optional</sup> <a name="logging" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.logging"></a>

```typescript
public readonly logging: LoggerOptions;
```

- *Type:* projen.LoggerOptions
- *Default:* {}

Configure logging options such as verbosity.

---

##### `outdir`<sup>Optional</sup> <a name="outdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string
- *Default:* "."

The root directory of the project.

Relative to this directory, all files are synthesized.  If this project has a parent, this directory is relative to the parent directory and it cannot be the same as the parent or any of it's other sub-projects.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

The parent project, if this project is part of a bigger project.

---

##### `projenCommand`<sup>Optional</sup> <a name="projenCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string
- *Default:* "npx projen"

The shell command to use in order to run the projen CLI.

Can be used to customize in special environments.

---

##### `projenrcJson`<sup>Optional</sup> <a name="projenrcJson" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJson"></a>

```typescript
public readonly projenrcJson: boolean;
```

- *Type:* boolean
- *Default:* false

Generate (once) .projenrc.json (in JSON). Set to `false` in order to disable .projenrc.json generation.

---

##### `projenrcJsonOptions`<sup>Optional</sup> <a name="projenrcJsonOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJsonOptions"></a>

```typescript
public readonly projenrcJsonOptions: ProjenrcOptions;
```

- *Type:* projen.ProjenrcOptions
- *Default:* default options

Options for .projenrc.json.

---

##### `autoApproveOptions`<sup>Optional</sup> <a name="autoApproveOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoApproveOptions"></a>

```typescript
public readonly autoApproveOptions: AutoApproveOptions;
```

- *Type:* projen.github.AutoApproveOptions
- *Default:* auto approve is disabled

Enable and configure the 'auto approve' workflow.

---

##### `autoMergeOptions`<sup>Optional</sup> <a name="autoMergeOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoMergeOptions"></a>

```typescript
public readonly autoMergeOptions: AutoMergeOptions;
```

- *Type:* projen.github.AutoMergeOptions
- *Default:* see defaults in `AutoMergeOptions`

Configure options for automatic merging on GitHub.

Has no effect if `github.mergify` is set to false.

---

##### `clobber`<sup>Optional</sup> <a name="clobber" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.clobber"></a>

```typescript
public readonly clobber: boolean;
```

- *Type:* boolean
- *Default:* true

Add a `clobber` task which resets the repo to origin.

---

##### `devContainer`<sup>Optional</sup> <a name="devContainer" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.devContainer"></a>

```typescript
public readonly devContainer: boolean;
```

- *Type:* boolean
- *Default:* false

Add a VSCode development environment (used for GitHub Codespaces).

---

##### `github`<sup>Optional</sup> <a name="github" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.github"></a>

```typescript
public readonly github: boolean;
```

- *Type:* boolean
- *Default:* true

Enable GitHub integration.

Enabled by default for root projects. Disabled for non-root projects.

---

##### `githubOptions`<sup>Optional</sup> <a name="githubOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.githubOptions"></a>

```typescript
public readonly githubOptions: GitHubOptions;
```

- *Type:* projen.github.GitHubOptions
- *Default:* see GitHubOptions

Options for GitHub integration.

---

##### `gitpod`<sup>Optional</sup> <a name="gitpod" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.gitpod"></a>

```typescript
public readonly gitpod: boolean;
```

- *Type:* boolean
- *Default:* false

Add a Gitpod development environment.

---

##### ~~`mergify`~~<sup>Optional</sup> <a name="mergify" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.mergify"></a>

- *Deprecated:* use `githubOptions.mergify` instead

```typescript
public readonly mergify: boolean;
```

- *Type:* boolean
- *Default:* true

Whether mergify should be enabled on this repository or not.

---

##### ~~`mergifyOptions`~~<sup>Optional</sup> <a name="mergifyOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.mergifyOptions"></a>

- *Deprecated:* use `githubOptions.mergifyOptions` instead

```typescript
public readonly mergifyOptions: MergifyOptions;
```

- *Type:* projen.github.MergifyOptions
- *Default:* default options

Options for mergify.

---

##### ~~`projectType`~~<sup>Optional</sup> <a name="projectType" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projectType"></a>

- *Deprecated:* no longer supported at the base project level

```typescript
public readonly projectType: ProjectType;
```

- *Type:* projen.ProjectType
- *Default:* ProjectType.UNKNOWN

Which type of project this is (library/app).

---

##### `projenTokenSecret`<sup>Optional</sup> <a name="projenTokenSecret" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenTokenSecret"></a>

```typescript
public readonly projenTokenSecret: string;
```

- *Type:* string
- *Default:* "PROJEN_GITHUB_TOKEN"

The name of a secret which includes a GitHub Personal Access Token to be used by projen workflows.

This token needs to have the `repo`, `workflows` and `packages` scope.

---

##### `readme`<sup>Optional</sup> <a name="readme" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.readme"></a>

```typescript
public readonly readme: SampleReadmeProps;
```

- *Type:* projen.SampleReadmeProps
- *Default:* { filename: 'README.md', contents: '# replace this' }

The README setup.

---

##### `stale`<sup>Optional</sup> <a name="stale" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.stale"></a>

```typescript
public readonly stale: boolean;
```

- *Type:* boolean
- *Default:* true

Auto-close of stale issues and pull request.

See `staleOptions` for options.

---

##### `staleOptions`<sup>Optional</sup> <a name="staleOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.staleOptions"></a>

```typescript
public readonly staleOptions: StaleOptions;
```

- *Type:* projen.github.StaleOptions
- *Default:* see defaults in `StaleOptions`

Auto-close stale issues and pull requests.

To disable set `stale` to `false`.

---

##### `vscode`<sup>Optional</sup> <a name="vscode" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.vscode"></a>

```typescript
public readonly vscode: boolean;
```

- *Type:* boolean
- *Default:* true

Enable VSCode integration.

Enabled by default for root projects. Disabled for non-root projects.

---

##### `allowLibraryDependencies`<sup>Optional</sup> <a name="allowLibraryDependencies" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.allowLibraryDependencies"></a>

```typescript
public readonly allowLibraryDependencies: boolean;
```

- *Type:* boolean
- *Default:* true

Allow the project to include `peerDependencies` and `bundledDependencies`.

This is normally only allowed for libraries. For apps, there's no meaning for specifying these.

---

##### `authorEmail`<sup>Optional</sup> <a name="authorEmail" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorEmail"></a>

```typescript
public readonly authorEmail: string;
```

- *Type:* string

Author's e-mail.

---

##### `authorName`<sup>Optional</sup> <a name="authorName" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorName"></a>

```typescript
public readonly authorName: string;
```

- *Type:* string

Author's name.

---

##### `authorOrganization`<sup>Optional</sup> <a name="authorOrganization" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorOrganization"></a>

```typescript
public readonly authorOrganization: boolean;
```

- *Type:* boolean

Author's Organization.

---

##### `authorUrl`<sup>Optional</sup> <a name="authorUrl" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.authorUrl"></a>

```typescript
public readonly authorUrl: string;
```

- *Type:* string

Author's URL / Website.

---

##### `autoDetectBin`<sup>Optional</sup> <a name="autoDetectBin" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoDetectBin"></a>

```typescript
public readonly autoDetectBin: boolean;
```

- *Type:* boolean
- *Default:* true

Automatically add all executables under the `bin` directory to your `package.json` file under the `bin` section.

---

##### `bin`<sup>Optional</sup> <a name="bin" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bin"></a>

```typescript
public readonly bin: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Binary programs vended with your module.

You can use this option to add/customize how binaries are represented in your `package.json`, but unless `autoDetectBin` is `false`, every executable file under `bin` will automatically be added to this section.

---

##### `bugsEmail`<sup>Optional</sup> <a name="bugsEmail" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bugsEmail"></a>

```typescript
public readonly bugsEmail: string;
```

- *Type:* string

The email address to which issues should be reported.

---

##### `bugsUrl`<sup>Optional</sup> <a name="bugsUrl" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bugsUrl"></a>

```typescript
public readonly bugsUrl: string;
```

- *Type:* string

The url to your project's issue tracker.

---

##### `bundledDeps`<sup>Optional</sup> <a name="bundledDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bundledDeps"></a>

```typescript
public readonly bundledDeps: string[];
```

- *Type:* string[]

List of dependencies to bundle into this module.

These modules will be added both to the `dependencies` section and `bundledDependencies` section of your `package.json`.  The recommendation is to only specify the module name here (e.g. `express`). This will behave similar to `yarn add` or `npm install` in the sense that it will add the module as a dependency to your `package.json` file with the latest version (`^`). You can specify semver requirements in the same syntax passed to `npm i` or `yarn add` (e.g. `express@^2`) and this will be what you `package.json` will eventually include.

---

##### `codeArtifactOptions`<sup>Optional</sup> <a name="codeArtifactOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.codeArtifactOptions"></a>

```typescript
public readonly codeArtifactOptions: CodeArtifactOptions;
```

- *Type:* projen.javascript.CodeArtifactOptions
- *Default:* undefined

Options for publishing npm package to AWS CodeArtifact.

---

##### `deps`<sup>Optional</sup> <a name="deps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.deps"></a>

```typescript
public readonly deps: string[];
```

- *Type:* string[]
- *Default:* []

Runtime dependencies of this module.

The recommendation is to only specify the module name here (e.g. `express`). This will behave similar to `yarn add` or `npm install` in the sense that it will add the module as a dependency to your `package.json` file with the latest version (`^`). You can specify semver requirements in the same syntax passed to `npm i` or `yarn add` (e.g. `express@^2`) and this will be what you `package.json` will eventually include.

---

##### `description`<sup>Optional</sup> <a name="description" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description is just a string that helps people understand the purpose of the package.

It can be used when searching for packages in a package manager as well. See https://classic.yarnpkg.com/en/docs/package-json/#toc-description

---

##### `devDeps`<sup>Optional</sup> <a name="devDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.devDeps"></a>

```typescript
public readonly devDeps: string[];
```

- *Type:* string[]
- *Default:* []

Build dependencies for this module.

These dependencies will only be available in your build environment but will not be fetched when this module is consumed.  The recommendation is to only specify the module name here (e.g. `express`). This will behave similar to `yarn add` or `npm install` in the sense that it will add the module as a dependency to your `package.json` file with the latest version (`^`). You can specify semver requirements in the same syntax passed to `npm i` or `yarn add` (e.g. `express@^2`) and this will be what you `package.json` will eventually include.

---

##### `entrypoint`<sup>Optional</sup> <a name="entrypoint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.entrypoint"></a>

```typescript
public readonly entrypoint: string;
```

- *Type:* string
- *Default:* "lib/index.js"

Module entrypoint (`main` in `package.json`).

Set to an empty string to not include `main` in your package.json

---

##### `homepage`<sup>Optional</sup> <a name="homepage" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.homepage"></a>

```typescript
public readonly homepage: string;
```

- *Type:* string

Package's Homepage / Website.

---

##### `keywords`<sup>Optional</sup> <a name="keywords" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.keywords"></a>

```typescript
public readonly keywords: string[];
```

- *Type:* string[]

Keywords to include in `package.json`.

---

##### `license`<sup>Optional</sup> <a name="license" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.license"></a>

```typescript
public readonly license: string;
```

- *Type:* string
- *Default:* "Apache-2.0"

License's SPDX identifier.

See https://github.com/projen/projen/tree/main/license-text for a list of supported licenses. Use the `licensed` option if you want to no license to be specified.

---

##### `licensed`<sup>Optional</sup> <a name="licensed" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.licensed"></a>

```typescript
public readonly licensed: boolean;
```

- *Type:* boolean
- *Default:* true

Indicates if a license should be added.

---

##### `maxNodeVersion`<sup>Optional</sup> <a name="maxNodeVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.maxNodeVersion"></a>

```typescript
public readonly maxNodeVersion: string;
```

- *Type:* string
- *Default:* no max

Minimum node.js version to require via `engines` (inclusive).

---

##### `minNodeVersion`<sup>Optional</sup> <a name="minNodeVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.minNodeVersion"></a>

```typescript
public readonly minNodeVersion: string;
```

- *Type:* string
- *Default:* no "engines" specified

Minimum Node.js version to require via package.json `engines` (inclusive).

---

##### `npmAccess`<sup>Optional</sup> <a name="npmAccess" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmAccess"></a>

```typescript
public readonly npmAccess: NpmAccess;
```

- *Type:* projen.javascript.NpmAccess
- *Default:* for scoped packages (e.g. `foo@bar`), the default is `NpmAccess.RESTRICTED`, for non-scoped packages, the default is `NpmAccess.PUBLIC`.

Access level of the npm package.

---

##### ~~`npmRegistry`~~<sup>Optional</sup> <a name="npmRegistry" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmRegistry"></a>

- *Deprecated:* use `npmRegistryUrl` instead

```typescript
public readonly npmRegistry: string;
```

- *Type:* string

The host name of the npm registry to publish to.

Cannot be set together with `npmRegistryUrl`.

---

##### `npmRegistryUrl`<sup>Optional</sup> <a name="npmRegistryUrl" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmRegistryUrl"></a>

```typescript
public readonly npmRegistryUrl: string;
```

- *Type:* string
- *Default:* "https://registry.npmjs.org"

The base URL of the npm package registry.

Must be a URL (e.g. start with "https://" or "http://")

---

##### `npmTokenSecret`<sup>Optional</sup> <a name="npmTokenSecret" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmTokenSecret"></a>

```typescript
public readonly npmTokenSecret: string;
```

- *Type:* string
- *Default:* "NPM_TOKEN"

GitHub secret which contains the NPM token to use when publishing packages.

---

##### `packageManager`<sup>Optional</sup> <a name="packageManager" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.packageManager"></a>

```typescript
public readonly packageManager: NodePackageManager;
```

- *Type:* projen.javascript.NodePackageManager
- *Default:* NodePackageManager.YARN

The Node Package Manager used to execute scripts.

---

##### `packageName`<sup>Optional</sup> <a name="packageName" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.packageName"></a>

```typescript
public readonly packageName: string;
```

- *Type:* string
- *Default:* defaults to project name

The "name" in package.json.

---

##### `peerDependencyOptions`<sup>Optional</sup> <a name="peerDependencyOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.peerDependencyOptions"></a>

```typescript
public readonly peerDependencyOptions: PeerDependencyOptions;
```

- *Type:* projen.javascript.PeerDependencyOptions

Options for `peerDeps`.

---

##### `peerDeps`<sup>Optional</sup> <a name="peerDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.peerDeps"></a>

```typescript
public readonly peerDeps: string[];
```

- *Type:* string[]
- *Default:* []

Peer dependencies for this module.

Dependencies listed here are required to be installed (and satisfied) by the _consumer_ of this library. Using peer dependencies allows you to ensure that only a single module of a certain library exists in the `node_modules` tree of your consumers.  Note that prior to npm@7, peer dependencies are _not_ automatically installed, which means that adding peer dependencies to a library will be a breaking change for your customers.  Unless `peerDependencyOptions.pinnedDevDependency` is disabled (it is enabled by default), projen will automatically add a dev dependency with a pinned version for each peer dependency. This will ensure that you build & test your module against the lowest peer version required.

---

##### `repository`<sup>Optional</sup> <a name="repository" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.repository"></a>

```typescript
public readonly repository: string;
```

- *Type:* string

The repository is the location where the actual code for your package lives.

See https://classic.yarnpkg.com/en/docs/package-json/#toc-repository

---

##### `repositoryDirectory`<sup>Optional</sup> <a name="repositoryDirectory" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.repositoryDirectory"></a>

```typescript
public readonly repositoryDirectory: string;
```

- *Type:* string

If the package.json for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives.

---

##### `scripts`<sup>Optional</sup> <a name="scripts" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.scripts"></a>

```typescript
public readonly scripts: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

npm scripts to include.

If a script has the same name as a standard script, the standard script will be overwritten.

---

##### `stability`<sup>Optional</sup> <a name="stability" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.stability"></a>

```typescript
public readonly stability: string;
```

- *Type:* string

Package's Stability.

---

##### `jsiiReleaseVersion`<sup>Optional</sup> <a name="jsiiReleaseVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.jsiiReleaseVersion"></a>

```typescript
public readonly jsiiReleaseVersion: string;
```

- *Type:* string
- *Default:* "latest"

Version requirement of `publib` which is used to publish modules to npm.

---

##### `majorVersion`<sup>Optional</sup> <a name="majorVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.majorVersion"></a>

```typescript
public readonly majorVersion: number;
```

- *Type:* number
- *Default:* Major version is not enforced.

Major version to release from the default branch.

If this is specified, we bump the latest version of this major version line. If not specified, we bump the global latest version.

---

##### `npmDistTag`<sup>Optional</sup> <a name="npmDistTag" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmDistTag"></a>

```typescript
public readonly npmDistTag: string;
```

- *Type:* string
- *Default:* "latest"

The npmDistTag to use when publishing from the default branch.

To set the npm dist-tag for release branches, set the `npmDistTag` property for each branch.

---

##### `postBuildSteps`<sup>Optional</sup> <a name="postBuildSteps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.postBuildSteps"></a>

```typescript
public readonly postBuildSteps: JobStep[];
```

- *Type:* projen.github.workflows.JobStep[]
- *Default:* []

Steps to execute after build as part of the release workflow.

---

##### `prerelease`<sup>Optional</sup> <a name="prerelease" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.prerelease"></a>

```typescript
public readonly prerelease: string;
```

- *Type:* string
- *Default:* normal semantic versions

Bump versions from the default branch as pre-releases (e.g. "beta", "alpha", "pre").

---

##### `publishDryRun`<sup>Optional</sup> <a name="publishDryRun" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.publishDryRun"></a>

```typescript
public readonly publishDryRun: boolean;
```

- *Type:* boolean
- *Default:* false

Instead of actually publishing to package managers, just print the publishing command.

---

##### `publishTasks`<sup>Optional</sup> <a name="publishTasks" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.publishTasks"></a>

```typescript
public readonly publishTasks: boolean;
```

- *Type:* boolean
- *Default:* false

Define publishing tasks that can be executed manually as well as workflows.

Normally, publishing only happens within automated workflows. Enable this in order to create a publishing task for each publishing activity.

---

##### `releaseBranches`<sup>Optional</sup> <a name="releaseBranches" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseBranches"></a>

```typescript
public readonly releaseBranches: {[ key: string ]: BranchOptions};
```

- *Type:* {[ key: string ]: projen.release.BranchOptions}
- *Default:* no additional branches are used for release. you can use `addBranch()` to add additional branches.

Defines additional release branches.

A workflow will be created for each release branch which will publish releases from commits in this branch. Each release branch _must_ be assigned a major version number which is used to enforce that versions published from that branch always use that major version. If multiple branches are used, the `majorVersion` field must also be provided for the default branch.

---

##### ~~`releaseEveryCommit`~~<sup>Optional</sup> <a name="releaseEveryCommit" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseEveryCommit"></a>

- *Deprecated:* Use `releaseTrigger: ReleaseTrigger.continuous()` instead

```typescript
public readonly releaseEveryCommit: boolean;
```

- *Type:* boolean
- *Default:* true

Automatically release new versions every commit to one of branches in `releaseBranches`.

---

##### `releaseFailureIssue`<sup>Optional</sup> <a name="releaseFailureIssue" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseFailureIssue"></a>

```typescript
public readonly releaseFailureIssue: boolean;
```

- *Type:* boolean
- *Default:* false

Create a github issue on every failed publishing task.

---

##### `releaseFailureIssueLabel`<sup>Optional</sup> <a name="releaseFailureIssueLabel" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseFailureIssueLabel"></a>

```typescript
public readonly releaseFailureIssueLabel: string;
```

- *Type:* string
- *Default:* "failed-release"

The label to apply to issues indicating publish failures.

Only applies if `releaseFailureIssue` is true.

---

##### ~~`releaseSchedule`~~<sup>Optional</sup> <a name="releaseSchedule" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseSchedule"></a>

- *Deprecated:* Use `releaseTrigger: ReleaseTrigger.scheduled()` instead

```typescript
public readonly releaseSchedule: string;
```

- *Type:* string
- *Default:* no scheduled releases

CRON schedule to trigger new releases.

---

##### `releaseTagPrefix`<sup>Optional</sup> <a name="releaseTagPrefix" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseTagPrefix"></a>

```typescript
public readonly releaseTagPrefix: string;
```

- *Type:* string
- *Default:* no prefix

Automatically add the given prefix to release tags. Useful if you are releasing on multiple branches with overlapping version numbers.

Note: this prefix is used to detect the latest tagged version when bumping, so if you change this on a project with an existing version history, you may need to manually tag your latest release with the new prefix.

---

##### `releaseTrigger`<sup>Optional</sup> <a name="releaseTrigger" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseTrigger"></a>

```typescript
public readonly releaseTrigger: ReleaseTrigger;
```

- *Type:* projen.release.ReleaseTrigger
- *Default:* Continuous releases (`ReleaseTrigger.continuous()`)

The release trigger to use.

---

##### `releaseWorkflowName`<sup>Optional</sup> <a name="releaseWorkflowName" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseWorkflowName"></a>

```typescript
public readonly releaseWorkflowName: string;
```

- *Type:* string
- *Default:* "Release"

The name of the default release workflow.

---

##### `releaseWorkflowSetupSteps`<sup>Optional</sup> <a name="releaseWorkflowSetupSteps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseWorkflowSetupSteps"></a>

```typescript
public readonly releaseWorkflowSetupSteps: JobStep[];
```

- *Type:* projen.github.workflows.JobStep[]

A set of workflow steps to execute in order to setup the workflow container.

---

##### `versionrcOptions`<sup>Optional</sup> <a name="versionrcOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.versionrcOptions"></a>

```typescript
public readonly versionrcOptions: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* standard configuration applicable for GitHub repositories

Custom configuration used when creating changelog with standard-version package.

Given values either append to default configuration or overwrite values in it.

---

##### `workflowContainerImage`<sup>Optional</sup> <a name="workflowContainerImage" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowContainerImage"></a>

```typescript
public readonly workflowContainerImage: string;
```

- *Type:* string
- *Default:* default image

Container image to use for GitHub workflows.

---

##### `workflowRunsOn`<sup>Optional</sup> <a name="workflowRunsOn" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowRunsOn"></a>

```typescript
public readonly workflowRunsOn: string[];
```

- *Type:* string[]
- *Default:* ["ubuntu-latest"]

Github Runner selection labels.

---

##### `defaultReleaseBranch`<sup>Required</sup> <a name="defaultReleaseBranch" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.defaultReleaseBranch"></a>

```typescript
public readonly defaultReleaseBranch: string;
```

- *Type:* string
- *Default:* "main"

The name of the main release branch.

---

##### `artifactsDirectory`<sup>Optional</sup> <a name="artifactsDirectory" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.artifactsDirectory"></a>

```typescript
public readonly artifactsDirectory: string;
```

- *Type:* string
- *Default:* "dist"

A directory which will contain build artifacts.

---

##### `autoApproveProjenUpgrades`<sup>Optional</sup> <a name="autoApproveProjenUpgrades" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoApproveProjenUpgrades"></a>

```typescript
public readonly autoApproveProjenUpgrades: boolean;
```

- *Type:* boolean
- *Default:* false

Automatically approve projen upgrade PRs, allowing them to be merged by mergify (if configued).

Throw if set to true but `autoApproveOptions` are not defined.

---

##### `autoApproveUpgrades`<sup>Optional</sup> <a name="autoApproveUpgrades" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.autoApproveUpgrades"></a>

```typescript
public readonly autoApproveUpgrades: boolean;
```

- *Type:* boolean
- *Default:* true

Automatically approve deps upgrade PRs, allowing them to be merged by mergify (if configued).

Throw if set to true but `autoApproveOptions` are not defined.

---

##### `buildWorkflow`<sup>Optional</sup> <a name="buildWorkflow" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.buildWorkflow"></a>

```typescript
public readonly buildWorkflow: boolean;
```

- *Type:* boolean
- *Default:* true if not a subproject

Define a GitHub workflow for building PRs.

---

##### `buildWorkflowTriggers`<sup>Optional</sup> <a name="buildWorkflowTriggers" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.buildWorkflowTriggers"></a>

```typescript
public readonly buildWorkflowTriggers: Triggers;
```

- *Type:* projen.github.workflows.Triggers
- *Default:* "{ pullRequest: {}, workflowDispatch: {} }"

Build workflow triggers.

---

##### `bundlerOptions`<sup>Optional</sup> <a name="bundlerOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.bundlerOptions"></a>

```typescript
public readonly bundlerOptions: BundlerOptions;
```

- *Type:* projen.javascript.BundlerOptions

Options for `Bundler`.

---

##### `codeCov`<sup>Optional</sup> <a name="codeCov" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.codeCov"></a>

```typescript
public readonly codeCov: boolean;
```

- *Type:* boolean
- *Default:* false

Define a GitHub workflow step for sending code coverage metrics to https://codecov.io/ Uses codecov/codecov-action@v1 A secret is required for private repos. Configured with @codeCovTokenSecret.

---

##### `codeCovTokenSecret`<sup>Optional</sup> <a name="codeCovTokenSecret" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.codeCovTokenSecret"></a>

```typescript
public readonly codeCovTokenSecret: string;
```

- *Type:* string
- *Default:* if this option is not specified, only public repositories are supported

Define the secret name for a specified https://codecov.io/ token A secret is required to send coverage for private repositories.

---

##### `copyrightOwner`<sup>Optional</sup> <a name="copyrightOwner" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.copyrightOwner"></a>

```typescript
public readonly copyrightOwner: string;
```

- *Type:* string
- *Default:* defaults to the value of authorName or "" if `authorName` is undefined.

License copyright owner.

---

##### `copyrightPeriod`<sup>Optional</sup> <a name="copyrightPeriod" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.copyrightPeriod"></a>

```typescript
public readonly copyrightPeriod: string;
```

- *Type:* string
- *Default:* current year

The copyright years to put in the LICENSE file.

---

##### `dependabot`<sup>Optional</sup> <a name="dependabot" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.dependabot"></a>

```typescript
public readonly dependabot: boolean;
```

- *Type:* boolean
- *Default:* false

Use dependabot to handle dependency upgrades.

Cannot be used in conjunction with `depsUpgrade`.

---

##### `dependabotOptions`<sup>Optional</sup> <a name="dependabotOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.dependabotOptions"></a>

```typescript
public readonly dependabotOptions: DependabotOptions;
```

- *Type:* projen.github.DependabotOptions
- *Default:* default options

Options for dependabot.

---

##### `depsUpgrade`<sup>Optional</sup> <a name="depsUpgrade" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.depsUpgrade"></a>

```typescript
public readonly depsUpgrade: boolean;
```

- *Type:* boolean
- *Default:* true

Use github workflows to handle dependency upgrades.

Cannot be used in conjunction with `dependabot`.

---

##### `depsUpgradeOptions`<sup>Optional</sup> <a name="depsUpgradeOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.depsUpgradeOptions"></a>

```typescript
public readonly depsUpgradeOptions: UpgradeDependenciesOptions;
```

- *Type:* projen.javascript.UpgradeDependenciesOptions
- *Default:* default options

Options for depsUpgrade.

---

##### `gitignore`<sup>Optional</sup> <a name="gitignore" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.gitignore"></a>

```typescript
public readonly gitignore: string[];
```

- *Type:* string[]

Additional entries to .gitignore.

---

##### `jest`<sup>Optional</sup> <a name="jest" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.jest"></a>

```typescript
public readonly jest: boolean;
```

- *Type:* boolean
- *Default:* true

Setup jest unit tests.

---

##### `jestOptions`<sup>Optional</sup> <a name="jestOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.jestOptions"></a>

```typescript
public readonly jestOptions: JestOptions;
```

- *Type:* projen.javascript.JestOptions
- *Default:* default options

Jest options.

---

##### `mutableBuild`<sup>Optional</sup> <a name="mutableBuild" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.mutableBuild"></a>

```typescript
public readonly mutableBuild: boolean;
```

- *Type:* boolean
- *Default:* true

Automatically update files modified during builds to pull-request branches.

This means that any files synthesized by projen or e.g. test snapshots will always be up-to-date before a PR is merged.  Implies that PR builds do not have anti-tamper checks.

---

##### ~~`npmignore`~~<sup>Optional</sup> <a name="npmignore" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmignore"></a>

- *Deprecated:* - use `project.addPackageIgnore`

```typescript
public readonly npmignore: string[];
```

- *Type:* string[]

Additional entries to .npmignore.

---

##### `npmignoreEnabled`<sup>Optional</sup> <a name="npmignoreEnabled" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.npmignoreEnabled"></a>

```typescript
public readonly npmignoreEnabled: boolean;
```

- *Type:* boolean
- *Default:* true

Defines an .npmignore file. Normally this is only needed for libraries that are packaged as tarballs.

---

##### `package`<sup>Optional</sup> <a name="package" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.package"></a>

```typescript
public readonly package: boolean;
```

- *Type:* boolean
- *Default:* true

Defines a `package` task that will produce an npm tarball under the artifacts directory (e.g. `dist`).

---

##### `prettier`<sup>Optional</sup> <a name="prettier" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.prettier"></a>

```typescript
public readonly prettier: boolean;
```

- *Type:* boolean
- *Default:* false

Setup prettier.

---

##### `prettierOptions`<sup>Optional</sup> <a name="prettierOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.prettierOptions"></a>

```typescript
public readonly prettierOptions: PrettierOptions;
```

- *Type:* projen.javascript.PrettierOptions
- *Default:* default options

Prettier options.

---

##### `projenDevDependency`<sup>Optional</sup> <a name="projenDevDependency" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenDevDependency"></a>

```typescript
public readonly projenDevDependency: boolean;
```

- *Type:* boolean
- *Default:* true

Indicates of "projen" should be installed as a devDependency.

---

##### `projenrcJs`<sup>Optional</sup> <a name="projenrcJs" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJs"></a>

```typescript
public readonly projenrcJs: boolean;
```

- *Type:* boolean
- *Default:* true if projenrcJson is false

Generate (once) .projenrc.js (in JavaScript). Set to `false` in order to disable .projenrc.js generation.

---

##### `projenrcJsOptions`<sup>Optional</sup> <a name="projenrcJsOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcJsOptions"></a>

```typescript
public readonly projenrcJsOptions: ProjenrcOptions;
```

- *Type:* projen.javascript.ProjenrcOptions
- *Default:* default options

Options for .projenrc.js.

---

##### ~~`projenUpgradeAutoMerge`~~<sup>Optional</sup> <a name="projenUpgradeAutoMerge" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenUpgradeAutoMerge"></a>

- *Deprecated:* use `autoApproveProjenUpgrades`.

```typescript
public readonly projenUpgradeAutoMerge: boolean;
```

- *Type:* boolean
- *Default:* false

Automatically approve projen upgrade PRs, allowing them to be merged by mergify (if configued).

Throw if set to true but `autoApproveOptions` are not defined.

---

##### `projenUpgradeSchedule`<sup>Optional</sup> <a name="projenUpgradeSchedule" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenUpgradeSchedule"></a>

```typescript
public readonly projenUpgradeSchedule: string[];
```

- *Type:* string[]
- *Default:* [ "0 6 * * *" ]

Customize the projenUpgrade schedule in cron expression.

---

##### ~~`projenUpgradeSecret`~~<sup>Optional</sup> <a name="projenUpgradeSecret" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenUpgradeSecret"></a>

- *Deprecated:* use `githubTokenSecret` instead.

```typescript
public readonly projenUpgradeSecret: string;
```

- *Type:* string
- *Default:* no automatic projen upgrade pull requests

Periodically submits a pull request for projen upgrades (executes `yarn projen:upgrade`).

This setting is a GitHub secret name which contains a GitHub Access Token with `repo` and `workflow` permissions.  This token is used to submit the upgrade pull request, which will likely include workflow updates.  To create a personal access token see https://github.com/settings/tokens

---

##### `projenVersion`<sup>Optional</sup> <a name="projenVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenVersion"></a>

```typescript
public readonly projenVersion: string;
```

- *Type:* string
- *Default:* Defaults to the latest version.

Version of projen to install.

---

##### `pullRequestTemplate`<sup>Optional</sup> <a name="pullRequestTemplate" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.pullRequestTemplate"></a>

```typescript
public readonly pullRequestTemplate: boolean;
```

- *Type:* boolean
- *Default:* true

Include a GitHub pull request template.

---

##### `pullRequestTemplateContents`<sup>Optional</sup> <a name="pullRequestTemplateContents" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.pullRequestTemplateContents"></a>

```typescript
public readonly pullRequestTemplateContents: string[];
```

- *Type:* string[]
- *Default:* default content

The contents of the pull request template.

---

##### `release`<sup>Optional</sup> <a name="release" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.release"></a>

```typescript
public readonly release: boolean;
```

- *Type:* boolean
- *Default:* true (false for subprojects)

Add release management to this project.

---

##### `releaseToNpm`<sup>Optional</sup> <a name="releaseToNpm" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseToNpm"></a>

```typescript
public readonly releaseToNpm: boolean;
```

- *Type:* boolean
- *Default:* false

Automatically release to npm when new versions are introduced.

---

##### ~~`releaseWorkflow`~~<sup>Optional</sup> <a name="releaseWorkflow" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.releaseWorkflow"></a>

- *Deprecated:* see `release`.

```typescript
public readonly releaseWorkflow: boolean;
```

- *Type:* boolean
- *Default:* true if not a subproject

DEPRECATED: renamed to `release`.

---

##### `workflowBootstrapSteps`<sup>Optional</sup> <a name="workflowBootstrapSteps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowBootstrapSteps"></a>

```typescript
public readonly workflowBootstrapSteps: any[];
```

- *Type:* any[]
- *Default:* "yarn install --frozen-lockfile && yarn projen"

Workflow steps to use in order to bootstrap this repo.

---

##### `workflowGitIdentity`<sup>Optional</sup> <a name="workflowGitIdentity" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowGitIdentity"></a>

```typescript
public readonly workflowGitIdentity: GitIdentity;
```

- *Type:* projen.github.GitIdentity
- *Default:* GitHub Actions

The git identity to use in workflows.

---

##### `workflowNodeVersion`<sup>Optional</sup> <a name="workflowNodeVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.workflowNodeVersion"></a>

```typescript
public readonly workflowNodeVersion: string;
```

- *Type:* string
- *Default:* same as `minNodeVersion`

The node version to use in GitHub workflows.

---

##### `disableTsconfig`<sup>Optional</sup> <a name="disableTsconfig" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.disableTsconfig"></a>

```typescript
public readonly disableTsconfig: boolean;
```

- *Type:* boolean
- *Default:* false

Do not generate a `tsconfig.json` file (used by jsii projects since tsconfig.json is generated by the jsii compiler).

---

##### `docgen`<sup>Optional</sup> <a name="docgen" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.docgen"></a>

```typescript
public readonly docgen: boolean;
```

- *Type:* boolean
- *Default:* false

Docgen by Typedoc.

---

##### `docsDirectory`<sup>Optional</sup> <a name="docsDirectory" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.docsDirectory"></a>

```typescript
public readonly docsDirectory: string;
```

- *Type:* string
- *Default:* "docs"

Docs directory.

---

##### `entrypointTypes`<sup>Optional</sup> <a name="entrypointTypes" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.entrypointTypes"></a>

```typescript
public readonly entrypointTypes: string;
```

- *Type:* string
- *Default:* .d.ts file derived from the project's entrypoint (usually lib/index.d.ts)

The .d.ts file that includes the type declarations for this module.

---

##### `eslint`<sup>Optional</sup> <a name="eslint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.eslint"></a>

```typescript
public readonly eslint: boolean;
```

- *Type:* boolean
- *Default:* true

Setup eslint.

---

##### `eslintOptions`<sup>Optional</sup> <a name="eslintOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.eslintOptions"></a>

```typescript
public readonly eslintOptions: EslintOptions;
```

- *Type:* projen.javascript.EslintOptions
- *Default:* opinionated default options

Eslint options.

---

##### `libdir`<sup>Optional</sup> <a name="libdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.libdir"></a>

```typescript
public readonly libdir: string;
```

- *Type:* string
- *Default:* "lib"

Typescript  artifacts output directory.

---

##### `projenrcTs`<sup>Optional</sup> <a name="projenrcTs" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcTs"></a>

```typescript
public readonly projenrcTs: boolean;
```

- *Type:* boolean
- *Default:* false

Use TypeScript for your projenrc file (`.projenrc.ts`).

---

##### `projenrcTsOptions`<sup>Optional</sup> <a name="projenrcTsOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.projenrcTsOptions"></a>

```typescript
public readonly projenrcTsOptions: ProjenrcOptions;
```

- *Type:* projen.typescript.ProjenrcOptions

Options for .projenrc.ts.

---

##### `sampleCode`<sup>Optional</sup> <a name="sampleCode" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.sampleCode"></a>

```typescript
public readonly sampleCode: boolean;
```

- *Type:* boolean
- *Default:* true

Generate one-time sample in `src/` and `test/` if there are no files there.

---

##### `srcdir`<sup>Optional</sup> <a name="srcdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.srcdir"></a>

```typescript
public readonly srcdir: string;
```

- *Type:* string
- *Default:* "src"

Typescript sources directory.

---

##### `testdir`<sup>Optional</sup> <a name="testdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.testdir"></a>

```typescript
public readonly testdir: string;
```

- *Type:* string
- *Default:* "test"

Jest tests directory. Tests files should be named `xxx.test.ts`.

If this directory is under `srcdir` (e.g. `src/test`, `src/__tests__`), then tests are going to be compiled into `lib/` and executed as javascript. If the test directory is outside of `src`, then we configure jest to compile the code in-memory.

---

##### `tsconfig`<sup>Optional</sup> <a name="tsconfig" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.tsconfig"></a>

```typescript
public readonly tsconfig: TypescriptConfigOptions;
```

- *Type:* projen.javascript.TypescriptConfigOptions
- *Default:* default options

Custom TSConfig.

---

##### `tsconfigDev`<sup>Optional</sup> <a name="tsconfigDev" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.tsconfigDev"></a>

```typescript
public readonly tsconfigDev: TypescriptConfigOptions;
```

- *Type:* projen.javascript.TypescriptConfigOptions
- *Default:* use the production tsconfig options

Custom tsconfig options for the development tsconfig.json file (used for testing).

---

##### `tsconfigDevFile`<sup>Optional</sup> <a name="tsconfigDevFile" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.tsconfigDevFile"></a>

```typescript
public readonly tsconfigDevFile: string;
```

- *Type:* string
- *Default:* "tsconfig.dev.json"

The name of the development tsconfig.json file.

---

##### `typescriptVersion`<sup>Optional</sup> <a name="typescriptVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.typescriptVersion"></a>

```typescript
public readonly typescriptVersion: string;
```

- *Type:* string
- *Default:* "latest"

TypeScript version to use.

NOTE: Typescript is not semantically versioned and should remain on the same minor, so we recommend using a `~` dependency (e.g. `~1.2.3`).

---

##### `buildCommand`<sup>Optional</sup> <a name="buildCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.buildCommand"></a>

```typescript
public readonly buildCommand: string;
```

- *Type:* string
- *Default:* no build command

A command to execute before synthesis.

This command will be called when running `cdk synth` or when `cdk watch` identifies a change in your source code before redeployment.

---

##### `cdkout`<sup>Optional</sup> <a name="cdkout" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkout"></a>

```typescript
public readonly cdkout: string;
```

- *Type:* string
- *Default:* "cdk.out"

cdk.out directory.

---

##### `context`<sup>Optional</sup> <a name="context" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.context"></a>

```typescript
public readonly context: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* no additional context

Additional context to include in `cdk.json`.

---

##### `featureFlags`<sup>Optional</sup> <a name="featureFlags" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.featureFlags"></a>

```typescript
public readonly featureFlags: boolean;
```

- *Type:* boolean
- *Default:* true

Include all feature flags in cdk.json.

---

##### `requireApproval`<sup>Optional</sup> <a name="requireApproval" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.requireApproval"></a>

```typescript
public readonly requireApproval: ApprovalLevel;
```

- *Type:* projen.awscdk.ApprovalLevel
- *Default:* ApprovalLevel.BROADENING

To protect you against unintended changes that affect your security posture, the AWS CDK Toolkit prompts you to approve security-related changes before deploying them.

---

##### `watchExcludes`<sup>Optional</sup> <a name="watchExcludes" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.watchExcludes"></a>

```typescript
public readonly watchExcludes: string[];
```

- *Type:* string[]
- *Default:* []

Glob patterns to exclude from `cdk watch`.

---

##### `watchIncludes`<sup>Optional</sup> <a name="watchIncludes" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.watchIncludes"></a>

```typescript
public readonly watchIncludes: string[];
```

- *Type:* string[]
- *Default:* []

Glob patterns to include in `cdk watch`.

---

##### `cdkVersion`<sup>Required</sup> <a name="cdkVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkVersion"></a>

```typescript
public readonly cdkVersion: string;
```

- *Type:* string
- *Default:* "2.1.0"

Minimum version of the AWS CDK to depend on.

---

##### ~~`cdkAssert`~~<sup>Optional</sup> <a name="cdkAssert" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkAssert"></a>

- *Deprecated:* The

```typescript
public readonly cdkAssert: boolean;
```

- *Type:* boolean
- *Default:* will be included by default for AWS CDK >= 1.0.0 < 2.0.0

Warning: NodeJS only.

Install the @aws-cdk/assert library?

---

##### `cdkAssertions`<sup>Optional</sup> <a name="cdkAssertions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkAssertions"></a>

```typescript
public readonly cdkAssertions: boolean;
```

- *Type:* boolean
- *Default:* will be included by default for AWS CDK >= 1.111.0 < 2.0.0

Install the assertions library?

Only needed for CDK 1.x. If using CDK 2.x then assertions is already included in 'aws-cdk-lib'

---

##### ~~`cdkDependencies`~~<sup>Optional</sup> <a name="cdkDependencies" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkDependencies"></a>

- *Deprecated:* For CDK 2.x use "deps" instead. (or "peerDeps" if you're building a library)

```typescript
public readonly cdkDependencies: string[];
```

- *Type:* string[]

Which AWS CDKv1 modules this project requires.

---

##### ~~`cdkDependenciesAsDeps`~~<sup>Optional</sup> <a name="cdkDependenciesAsDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkDependenciesAsDeps"></a>

- *Deprecated:* Not supported in CDK v2.

```typescript
public readonly cdkDependenciesAsDeps: boolean;
```

- *Type:* boolean
- *Default:* true

If this is enabled (default), all modules declared in `cdkDependencies` will be also added as normal `dependencies` (as well as `peerDependencies`).

This is to ensure that downstream consumers actually have your CDK dependencies installed when using npm < 7 or yarn, where peer dependencies are not automatically installed. If this is disabled, `cdkDependencies` will be added to `devDependencies` to ensure they are present during development.  Note: this setting only applies to construct library projects

---

##### ~~`cdkTestDependencies`~~<sup>Optional</sup> <a name="cdkTestDependencies" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkTestDependencies"></a>

- *Deprecated:* For CDK 2.x use 'devDeps' (in node.js projects) or 'testDeps' (in java projects) instead

```typescript
public readonly cdkTestDependencies: string[];
```

- *Type:* string[]

AWS CDK modules required for testing.

---

##### `cdkVersionPinning`<sup>Optional</sup> <a name="cdkVersionPinning" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.cdkVersionPinning"></a>

```typescript
public readonly cdkVersionPinning: boolean;
```

- *Type:* boolean

Use pinned version instead of caret version for CDK.

You can use this to prevent mixed versions for your CDK dependencies and to prevent auto-updates. If you use experimental features this will let you define the moment you include breaking changes.

---

##### `constructsVersion`<sup>Optional</sup> <a name="constructsVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.constructsVersion"></a>

```typescript
public readonly constructsVersion: string;
```

- *Type:* string
- *Default:* for CDK 1.x the default is "3.2.27", for CDK 2.x the default is "10.0.5".

Minimum version of the `constructs` library to depend on.

---

##### `appEntrypoint`<sup>Optional</sup> <a name="appEntrypoint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.appEntrypoint"></a>

```typescript
public readonly appEntrypoint: string;
```

- *Type:* string
- *Default:* "main.ts"

The CDK app's entrypoint (relative to the source directory, which is "src" by default).

---

##### `integrationTestAutoDiscover`<sup>Optional</sup> <a name="integrationTestAutoDiscover" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.integrationTestAutoDiscover"></a>

```typescript
public readonly integrationTestAutoDiscover: boolean;
```

- *Type:* boolean
- *Default:* true

Automatically discovers and creates integration tests for each `.integ.ts` file in under your test directory.

---

##### `lambdaAutoDiscover`<sup>Optional</sup> <a name="lambdaAutoDiscover" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.lambdaAutoDiscover"></a>

```typescript
public readonly lambdaAutoDiscover: boolean;
```

- *Type:* boolean
- *Default:* true

Automatically adds an `awscdk.LambdaFunction` for each `.lambda.ts` handler in your source tree. If this is disabled, you can manually add an `awscdk.AutoDiscover` component to your project.

---

##### `lambdaOptions`<sup>Optional</sup> <a name="lambdaOptions" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions.property.lambdaOptions"></a>

```typescript
public readonly lambdaOptions: LambdaFunctionCommonOptions;
```

- *Type:* projen.awscdk.LambdaFunctionCommonOptions
- *Default:* default options

Common options for all AWS Lambda functions.

---

## Classes <a name="Classes" id="Classes"></a>

### ClickUpCdkTypeScriptApp <a name="ClickUpCdkTypeScriptApp" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp"></a>

ClickUp standardized CDK TypeScript App.

Includes: - default author information - default proprietary license - default release build configuration - default linting and codecov configuration - default minNodeVersion: '14.15.0' - default deps and devDeps (you can add your own, but the base will always be present)

#### Initializers <a name="Initializers" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.Initializer"></a>

```typescript
import { clickupCdk } from '@time-loop/clickup-projen'

new clickupCdk.ClickUpCdkTypeScriptApp(options: ClickUpCdkTypeScriptAppOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.Initializer.parameter.options">options</a></code> | <code>@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.Initializer.parameter.options"></a>

- *Type:* @time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptAppOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addExcludeFromCleanup">addExcludeFromCleanup</a></code> | Exclude the matching files from pre-synth cleanup. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addGitIgnore">addGitIgnore</a></code> | Adds a .gitignore pattern. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addPackageIgnore">addPackageIgnore</a></code> | Exclude these files from the bundled package. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTask">addTask</a></code> | Adds a new task to this project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTip">addTip</a></code> | Prints a "tip" message during synthesis. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.annotateGenerated">annotateGenerated</a></code> | Marks the provided file(s) as being generated. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.postSynthesize">postSynthesize</a></code> | Called after all components are synthesized. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.preSynthesize">preSynthesize</a></code> | Called before all components are synthesized. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.removeTask">removeTask</a></code> | Removes a task from a project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.runTaskCommand">runTaskCommand</a></code> | Returns the shell command to execute in order to run a task. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.synth">synth</a></code> | Synthesize all project files into `outdir`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindFile">tryFindFile</a></code> | Finds a file at the specified relative path within this project and all its subprojects. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindJsonFile">tryFindJsonFile</a></code> | Finds a json file by name. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindObjectFile">tryFindObjectFile</a></code> | Finds an object file (like JsonFile, YamlFile, etc.) by name. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addBins">addBins</a></code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addBundledDeps">addBundledDeps</a></code> | Defines bundled dependencies. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addCompileCommand">addCompileCommand</a></code> | DEPRECATED. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addDeps">addDeps</a></code> | Defines normal dependencies. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addDevDeps">addDevDeps</a></code> | Defines development/test dependencies. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addFields">addFields</a></code> | Directly set fields in `package.json`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addKeywords">addKeywords</a></code> | Adds keywords to package.json (deduplicated). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addPeerDeps">addPeerDeps</a></code> | Defines peer dependencies. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTestCommand">addTestCommand</a></code> | DEPRECATED. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.hasScript">hasScript</a></code> | Indicates if a script by the name name is defined. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.removeScript">removeScript</a></code> | Removes the npm script (always successful). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.renderWorkflowSetup">renderWorkflowSetup</a></code> | Returns the set of workflow steps which should be executed to bootstrap a workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.setScript">setScript</a></code> | Replaces the contents of an npm package.json script. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addCdkDependency">addCdkDependency</a></code> | Adds an AWS CDK module dependencies. |

---

##### `addExcludeFromCleanup` <a name="addExcludeFromCleanup" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addExcludeFromCleanup"></a>

```typescript
public addExcludeFromCleanup(globs: string): void
```

Exclude the matching files from pre-synth cleanup.

Can be used when, for example, some source files include the projen marker and we don't want them to be erased during synth.

###### `globs`<sup>Required</sup> <a name="globs" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addExcludeFromCleanup.parameter.globs"></a>

- *Type:* string

The glob patterns to match.

---

##### `addGitIgnore` <a name="addGitIgnore" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addGitIgnore"></a>

```typescript
public addGitIgnore(pattern: string): void
```

Adds a .gitignore pattern.

###### `pattern`<sup>Required</sup> <a name="pattern" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addGitIgnore.parameter.pattern"></a>

- *Type:* string

The glob pattern to ignore.

---

##### `addPackageIgnore` <a name="addPackageIgnore" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addPackageIgnore"></a>

```typescript
public addPackageIgnore(pattern: string): void
```

Exclude these files from the bundled package.

Implemented by project types based on the packaging mechanism. For example, `NodeProject` delegates this to `.npmignore`.

###### `pattern`<sup>Required</sup> <a name="pattern" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addPackageIgnore.parameter.pattern"></a>

- *Type:* string

---

##### `addTask` <a name="addTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTask"></a>

```typescript
public addTask(name: string, props?: TaskOptions): Task
```

Adds a new task to this project.

This will fail if the project already has a task with this name.

###### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTask.parameter.name"></a>

- *Type:* string

The task name to add.

---

###### `props`<sup>Optional</sup> <a name="props" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTask.parameter.props"></a>

- *Type:* projen.TaskOptions

Task properties.

---

##### ~~`addTip`~~ <a name="addTip" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTip"></a>

```typescript
public addTip(message: string): void
```

Prints a "tip" message during synthesis.

###### `message`<sup>Required</sup> <a name="message" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTip.parameter.message"></a>

- *Type:* string

The message.

---

##### `annotateGenerated` <a name="annotateGenerated" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.annotateGenerated"></a>

```typescript
public annotateGenerated(glob: string): void
```

Marks the provided file(s) as being generated.

This is achieved using the github-linguist attributes. Generated files do not count against the repository statistics and language breakdown.

> [https://github.com/github/linguist/blob/master/docs/overrides.md](https://github.com/github/linguist/blob/master/docs/overrides.md)

###### `glob`<sup>Required</sup> <a name="glob" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.annotateGenerated.parameter.glob"></a>

- *Type:* string

the glob pattern to match (could be a file path).

---

##### `postSynthesize` <a name="postSynthesize" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.postSynthesize"></a>

```typescript
public postSynthesize(): void
```

Called after all components are synthesized.

Order is *not* guaranteed.

##### `preSynthesize` <a name="preSynthesize" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.preSynthesize"></a>

```typescript
public preSynthesize(): void
```

Called before all components are synthesized.

##### `removeTask` <a name="removeTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.removeTask"></a>

```typescript
public removeTask(name: string): Task
```

Removes a task from a project.

###### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.removeTask.parameter.name"></a>

- *Type:* string

The name of the task to remove.

---

##### `runTaskCommand` <a name="runTaskCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.runTaskCommand"></a>

```typescript
public runTaskCommand(task: Task): string
```

Returns the shell command to execute in order to run a task.

This will typically be `npx projen TASK`.

###### `task`<sup>Required</sup> <a name="task" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.runTaskCommand.parameter.task"></a>

- *Type:* projen.Task

The task for which the command is required.

---

##### `synth` <a name="synth" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.synth"></a>

```typescript
public synth(): void
```

Synthesize all project files into `outdir`.

1. Call "this.preSynthesize()" 2. Delete all generated files 3. Synthesize all sub-projects 4. Synthesize all components of this project 5. Call "postSynthesize()" for all components of this project 6. Call "this.postSynthesize()"

##### `tryFindFile` <a name="tryFindFile" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindFile"></a>

```typescript
public tryFindFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and all its subprojects.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be resolved from the root of _this_ project.

---

##### ~~`tryFindJsonFile`~~ <a name="tryFindJsonFile" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindJsonFile"></a>

```typescript
public tryFindJsonFile(filePath: string): JsonFile
```

Finds a json file by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindJsonFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryFindObjectFile` <a name="tryFindObjectFile" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindObjectFile"></a>

```typescript
public tryFindObjectFile(filePath: string): ObjectFile
```

Finds an object file (like JsonFile, YamlFile, etc.) by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.tryFindObjectFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `addBins` <a name="addBins" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addBins"></a>

```typescript
public addBins(bins: {[ key: string ]: string}): void
```

###### `bins`<sup>Required</sup> <a name="bins" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addBins.parameter.bins"></a>

- *Type:* {[ key: string ]: string}

---

##### `addBundledDeps` <a name="addBundledDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addBundledDeps"></a>

```typescript
public addBundledDeps(deps: string): void
```

Defines bundled dependencies.

Bundled dependencies will be added as normal dependencies as well as to the `bundledDependencies` section of your `package.json`.

###### `deps`<sup>Required</sup> <a name="deps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addBundledDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will be installed in the next `npx projen` run and the version will be recorded in your `package.json` file. You can upgrade manually or using `yarn add/upgrade`. If you wish to specify a version range use this syntax: `module@^7`.

---

##### ~~`addCompileCommand`~~ <a name="addCompileCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addCompileCommand"></a>

```typescript
public addCompileCommand(commands: string): void
```

DEPRECATED.

###### `commands`<sup>Required</sup> <a name="commands" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addCompileCommand.parameter.commands"></a>

- *Type:* string

---

##### `addDeps` <a name="addDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addDeps"></a>

```typescript
public addDeps(deps: string): void
```

Defines normal dependencies.

###### `deps`<sup>Required</sup> <a name="deps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will be installed in the next `npx projen` run and the version will be recorded in your `package.json` file. You can upgrade manually or using `yarn add/upgrade`. If you wish to specify a version range use this syntax: `module@^7`.

---

##### `addDevDeps` <a name="addDevDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addDevDeps"></a>

```typescript
public addDevDeps(deps: string): void
```

Defines development/test dependencies.

###### `deps`<sup>Required</sup> <a name="deps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addDevDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will be installed in the next `npx projen` run and the version will be recorded in your `package.json` file. You can upgrade manually or using `yarn add/upgrade`. If you wish to specify a version range use this syntax: `module@^7`.

---

##### `addFields` <a name="addFields" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addFields"></a>

```typescript
public addFields(fields: {[ key: string ]: any}): void
```

Directly set fields in `package.json`.

###### `fields`<sup>Required</sup> <a name="fields" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addFields.parameter.fields"></a>

- *Type:* {[ key: string ]: any}

The fields to set.

---

##### `addKeywords` <a name="addKeywords" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addKeywords"></a>

```typescript
public addKeywords(keywords: string): void
```

Adds keywords to package.json (deduplicated).

###### `keywords`<sup>Required</sup> <a name="keywords" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addKeywords.parameter.keywords"></a>

- *Type:* string

The keywords to add.

---

##### `addPeerDeps` <a name="addPeerDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addPeerDeps"></a>

```typescript
public addPeerDeps(deps: string): void
```

Defines peer dependencies.

When adding peer dependencies, a devDependency will also be added on the pinned version of the declared peer. This will ensure that you are testing your code against the minimum version required from your consumers.

###### `deps`<sup>Required</sup> <a name="deps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addPeerDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will be installed in the next `npx projen` run and the version will be recorded in your `package.json` file. You can upgrade manually or using `yarn add/upgrade`. If you wish to specify a version range use this syntax: `module@^7`.

---

##### ~~`addTestCommand`~~ <a name="addTestCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTestCommand"></a>

```typescript
public addTestCommand(commands: string): void
```

DEPRECATED.

###### `commands`<sup>Required</sup> <a name="commands" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addTestCommand.parameter.commands"></a>

- *Type:* string

---

##### `hasScript` <a name="hasScript" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.hasScript"></a>

```typescript
public hasScript(name: string): boolean
```

Indicates if a script by the name name is defined.

###### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.hasScript.parameter.name"></a>

- *Type:* string

The name of the script.

---

##### `removeScript` <a name="removeScript" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.removeScript"></a>

```typescript
public removeScript(name: string): void
```

Removes the npm script (always successful).

###### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.removeScript.parameter.name"></a>

- *Type:* string

The name of the script.

---

##### `renderWorkflowSetup` <a name="renderWorkflowSetup" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.renderWorkflowSetup"></a>

```typescript
public renderWorkflowSetup(options?: RenderWorkflowSetupOptions): JobStep[]
```

Returns the set of workflow steps which should be executed to bootstrap a workflow.

###### `options`<sup>Optional</sup> <a name="options" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.renderWorkflowSetup.parameter.options"></a>

- *Type:* projen.javascript.RenderWorkflowSetupOptions

Options.

---

##### `setScript` <a name="setScript" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.setScript"></a>

```typescript
public setScript(name: string, command: string): void
```

Replaces the contents of an npm package.json script.

###### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.setScript.parameter.name"></a>

- *Type:* string

The script name.

---

###### `command`<sup>Required</sup> <a name="command" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.setScript.parameter.command"></a>

- *Type:* string

The command to execute.

---

##### `addCdkDependency` <a name="addCdkDependency" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addCdkDependency"></a>

```typescript
public addCdkDependency(modules: string): void
```

Adds an AWS CDK module dependencies.

###### `modules`<sup>Required</sup> <a name="modules" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.addCdkDependency.parameter.modules"></a>

- *Type:* string

The list of modules to depend on.

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.buildTask">buildTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.compileTask">compileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.components">components</a></code> | <code>projen.Component[]</code> | Returns all the components within this project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.deps">deps</a></code> | <code>projen.Dependencies</code> | Project dependencies. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.ejected">ejected</a></code> | <code>boolean</code> | Whether or not the project is being ejected. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.files">files</a></code> | <code>projen.FileBase[]</code> | All files in this project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.gitattributes">gitattributes</a></code> | <code>projen.GitAttributesFile</code> | The .gitattributes file for this repository. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.gitignore">gitignore</a></code> | <code>projen.IgnoreFile</code> | .gitignore. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.logger">logger</a></code> | <code>projen.Logger</code> | Logging utilities. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.name">name</a></code> | <code>string</code> | Project name. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.outdir">outdir</a></code> | <code>string</code> | Absolute output directory of this project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.packageTask">packageTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.postCompileTask">postCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.preCompileTask">preCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.projectBuild">projectBuild</a></code> | <code>projen.ProjectBuild</code> | Manages the build process of the project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.projenCommand">projenCommand</a></code> | <code>string</code> | The command to use in order to run the projen CLI. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.root">root</a></code> | <code>projen.Project</code> | The root project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tasks">tasks</a></code> | <code>projen.Tasks</code> | Project tasks. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.testTask">testTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.defaultTask">defaultTask</a></code> | <code>projen.Task</code> | This is the "default" task, the one that executes "projen". |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.initProject">initProject</a></code> | <code>projen.InitProject</code> | The options used when this project is bootstrapped via `projen new`. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.parent">parent</a></code> | <code>projen.Project</code> | A parent project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.projectType">projectType</a></code> | <code>projen.ProjectType</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.autoApprove">autoApprove</a></code> | <code>projen.github.AutoApprove</code> | Auto approve set up for this project. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.devContainer">devContainer</a></code> | <code>projen.vscode.DevContainer</code> | Access for .devcontainer.json (used for GitHub Codespaces). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.github">github</a></code> | <code>projen.github.GitHub</code> | Access all github components. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.gitpod">gitpod</a></code> | <code>projen.Gitpod</code> | Access for Gitpod. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.vscode">vscode</a></code> | <code>projen.vscode.VsCode</code> | Access all VSCode components. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.allowLibraryDependencies">allowLibraryDependencies</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.artifactsDirectory">artifactsDirectory</a></code> | <code>string</code> | The build output directory. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.artifactsJavascriptDirectory">artifactsJavascriptDirectory</a></code> | <code>string</code> | The location of the npm tarball after build (`${artifactsDirectory}/js`). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.bundler">bundler</a></code> | <code>projen.javascript.Bundler</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.entrypoint">entrypoint</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.manifest">manifest</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.package">package</a></code> | <code>projen.javascript.NodePackage</code> | API for managing the node package. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.packageManager">packageManager</a></code> | <code>projen.javascript.NodePackageManager</code> | The package manager to use. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.runScriptCommand">runScriptCommand</a></code> | <code>string</code> | The command to use to run scripts (e.g. `yarn run` or `npm run` depends on the package manager). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.autoMerge">autoMerge</a></code> | <code>projen.github.AutoMerge</code> | Automatic PR merges. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.buildWorkflow">buildWorkflow</a></code> | <code>projen.build.BuildWorkflow</code> | The PR build GitHub workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.buildWorkflowJobId">buildWorkflowJobId</a></code> | <code>string</code> | The job ID of the build workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.jest">jest</a></code> | <code>projen.javascript.Jest</code> | The Jest configuration (if enabled). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.maxNodeVersion">maxNodeVersion</a></code> | <code>string</code> | Maximum node version required by this pacakge. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.minNodeVersion">minNodeVersion</a></code> | <code>string</code> | Minimum node.js version required by this package. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.npmignore">npmignore</a></code> | <code>projen.IgnoreFile</code> | The .npmignore file. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.prettier">prettier</a></code> | <code>projen.javascript.Prettier</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.publisher">publisher</a></code> | <code>projen.release.Publisher</code> | Package publisher. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.release">release</a></code> | <code>projen.release.Release</code> | Release management. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.upgradeWorkflow">upgradeWorkflow</a></code> | <code>projen.javascript.UpgradeDependencies</code> | The upgrade workflow. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.docsDirectory">docsDirectory</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.libdir">libdir</a></code> | <code>string</code> | The directory in which compiled .js files reside. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.srcdir">srcdir</a></code> | <code>string</code> | The directory in which the .ts sources reside. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.testdir">testdir</a></code> | <code>string</code> | The directory in which tests reside. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tsconfigDev">tsconfigDev</a></code> | <code>projen.javascript.TypescriptConfig</code> | A typescript configuration file which covers all files (sources, tests, projen). |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.watchTask">watchTask</a></code> | <code>projen.Task</code> | The "watch" task. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.docgen">docgen</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.eslint">eslint</a></code> | <code>projen.javascript.Eslint</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tsconfig">tsconfig</a></code> | <code>projen.javascript.TypescriptConfig</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tsconfigEslint">tsconfigEslint</a></code> | <code>projen.javascript.TypescriptConfig</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.appEntrypoint">appEntrypoint</a></code> | <code>string</code> | The CDK app entrypoint. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkConfig">cdkConfig</a></code> | <code>projen.awscdk.CdkConfig</code> | cdk.json configuration. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkDeps">cdkDeps</a></code> | <code>projen.awscdk.AwsCdkDeps</code> | *No description.* |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkTasks">cdkTasks</a></code> | <code>projen.awscdk.CdkTasks</code> | Common CDK tasks. |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkVersion">cdkVersion</a></code> | <code>string</code> | The CDK version this app is using. |

---

##### `buildTask`<sup>Required</sup> <a name="buildTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.buildTask"></a>

```typescript
public readonly buildTask: Task;
```

- *Type:* projen.Task

---

##### `compileTask`<sup>Required</sup> <a name="compileTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.compileTask"></a>

```typescript
public readonly compileTask: Task;
```

- *Type:* projen.Task

---

##### `components`<sup>Required</sup> <a name="components" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.components"></a>

```typescript
public readonly components: Component[];
```

- *Type:* projen.Component[]

Returns all the components within this project.

---

##### `deps`<sup>Required</sup> <a name="deps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.deps"></a>

```typescript
public readonly deps: Dependencies;
```

- *Type:* projen.Dependencies

Project dependencies.

---

##### `ejected`<sup>Required</sup> <a name="ejected" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.ejected"></a>

```typescript
public readonly ejected: boolean;
```

- *Type:* boolean

Whether or not the project is being ejected.

---

##### `files`<sup>Required</sup> <a name="files" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.files"></a>

```typescript
public readonly files: FileBase[];
```

- *Type:* projen.FileBase[]

All files in this project.

---

##### `gitattributes`<sup>Required</sup> <a name="gitattributes" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.gitattributes"></a>

```typescript
public readonly gitattributes: GitAttributesFile;
```

- *Type:* projen.GitAttributesFile

The .gitattributes file for this repository.

---

##### `gitignore`<sup>Required</sup> <a name="gitignore" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.gitignore"></a>

```typescript
public readonly gitignore: IgnoreFile;
```

- *Type:* projen.IgnoreFile

.gitignore.

---

##### `logger`<sup>Required</sup> <a name="logger" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.logger"></a>

```typescript
public readonly logger: Logger;
```

- *Type:* projen.Logger

Logging utilities.

---

##### `name`<sup>Required</sup> <a name="name" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Project name.

---

##### `outdir`<sup>Required</sup> <a name="outdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string

Absolute output directory of this project.

---

##### `packageTask`<sup>Required</sup> <a name="packageTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.packageTask"></a>

```typescript
public readonly packageTask: Task;
```

- *Type:* projen.Task

---

##### `postCompileTask`<sup>Required</sup> <a name="postCompileTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.postCompileTask"></a>

```typescript
public readonly postCompileTask: Task;
```

- *Type:* projen.Task

---

##### `preCompileTask`<sup>Required</sup> <a name="preCompileTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.preCompileTask"></a>

```typescript
public readonly preCompileTask: Task;
```

- *Type:* projen.Task

---

##### `projectBuild`<sup>Required</sup> <a name="projectBuild" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.projectBuild"></a>

```typescript
public readonly projectBuild: ProjectBuild;
```

- *Type:* projen.ProjectBuild

Manages the build process of the project.

---

##### `projenCommand`<sup>Required</sup> <a name="projenCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string

The command to use in order to run the projen CLI.

---

##### `root`<sup>Required</sup> <a name="root" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.root"></a>

```typescript
public readonly root: Project;
```

- *Type:* projen.Project

The root project.

---

##### `tasks`<sup>Required</sup> <a name="tasks" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tasks"></a>

```typescript
public readonly tasks: Tasks;
```

- *Type:* projen.Tasks

Project tasks.

---

##### `testTask`<sup>Required</sup> <a name="testTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.testTask"></a>

```typescript
public readonly testTask: Task;
```

- *Type:* projen.Task

---

##### `defaultTask`<sup>Optional</sup> <a name="defaultTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.defaultTask"></a>

```typescript
public readonly defaultTask: Task;
```

- *Type:* projen.Task

This is the "default" task, the one that executes "projen".

Undefined if the project is being ejected.

---

##### `initProject`<sup>Optional</sup> <a name="initProject" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.initProject"></a>

```typescript
public readonly initProject: InitProject;
```

- *Type:* projen.InitProject

The options used when this project is bootstrapped via `projen new`.

It includes the original set of options passed to the CLI and also the JSII FQN of the project type.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

A parent project.

If undefined, this is the root project.

---

##### `projectType`<sup>Required</sup> <a name="projectType" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.projectType"></a>

```typescript
public readonly projectType: ProjectType;
```

- *Type:* projen.ProjectType

---

##### `autoApprove`<sup>Optional</sup> <a name="autoApprove" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.autoApprove"></a>

```typescript
public readonly autoApprove: AutoApprove;
```

- *Type:* projen.github.AutoApprove

Auto approve set up for this project.

---

##### `devContainer`<sup>Optional</sup> <a name="devContainer" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.devContainer"></a>

```typescript
public readonly devContainer: DevContainer;
```

- *Type:* projen.vscode.DevContainer

Access for .devcontainer.json (used for GitHub Codespaces).

This will be `undefined` if devContainer boolean is false

---

##### `github`<sup>Optional</sup> <a name="github" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.github"></a>

```typescript
public readonly github: GitHub;
```

- *Type:* projen.github.GitHub

Access all github components.

This will be `undefined` for subprojects.

---

##### `gitpod`<sup>Optional</sup> <a name="gitpod" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.gitpod"></a>

```typescript
public readonly gitpod: Gitpod;
```

- *Type:* projen.Gitpod

Access for Gitpod.

This will be `undefined` if gitpod boolean is false

---

##### `vscode`<sup>Optional</sup> <a name="vscode" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.vscode"></a>

```typescript
public readonly vscode: VsCode;
```

- *Type:* projen.vscode.VsCode

Access all VSCode components.

This will be `undefined` for subprojects.

---

##### ~~`allowLibraryDependencies`~~<sup>Required</sup> <a name="allowLibraryDependencies" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.allowLibraryDependencies"></a>

- *Deprecated:* use `package.allowLibraryDependencies`

```typescript
public readonly allowLibraryDependencies: boolean;
```

- *Type:* boolean

---

##### `artifactsDirectory`<sup>Required</sup> <a name="artifactsDirectory" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.artifactsDirectory"></a>

```typescript
public readonly artifactsDirectory: string;
```

- *Type:* string

The build output directory.

An npm tarball will be created under the `js` subdirectory. For example, if this is set to `dist` (the default), the npm tarball will be placed under `dist/js/boom-boom-1.2.3.tg`.

---

##### `artifactsJavascriptDirectory`<sup>Required</sup> <a name="artifactsJavascriptDirectory" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.artifactsJavascriptDirectory"></a>

```typescript
public readonly artifactsJavascriptDirectory: string;
```

- *Type:* string

The location of the npm tarball after build (`${artifactsDirectory}/js`).

---

##### `bundler`<sup>Required</sup> <a name="bundler" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.bundler"></a>

```typescript
public readonly bundler: Bundler;
```

- *Type:* projen.javascript.Bundler

---

##### ~~`entrypoint`~~<sup>Required</sup> <a name="entrypoint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.entrypoint"></a>

- *Deprecated:* use `package.entrypoint`

```typescript
public readonly entrypoint: string;
```

- *Type:* string

---

##### ~~`manifest`~~<sup>Required</sup> <a name="manifest" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.manifest"></a>

- *Deprecated:* use `package.addField(x, y)`

```typescript
public readonly manifest: any;
```

- *Type:* any

---

##### `package`<sup>Required</sup> <a name="package" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.package"></a>

```typescript
public readonly package: NodePackage;
```

- *Type:* projen.javascript.NodePackage

API for managing the node package.

---

##### ~~`packageManager`~~<sup>Required</sup> <a name="packageManager" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.packageManager"></a>

- *Deprecated:* use `package.packageManager`

```typescript
public readonly packageManager: NodePackageManager;
```

- *Type:* projen.javascript.NodePackageManager

The package manager to use.

---

##### `runScriptCommand`<sup>Required</sup> <a name="runScriptCommand" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.runScriptCommand"></a>

```typescript
public readonly runScriptCommand: string;
```

- *Type:* string

The command to use to run scripts (e.g. `yarn run` or `npm run` depends on the package manager).

---

##### `autoMerge`<sup>Optional</sup> <a name="autoMerge" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.autoMerge"></a>

```typescript
public readonly autoMerge: AutoMerge;
```

- *Type:* projen.github.AutoMerge

Automatic PR merges.

---

##### `buildWorkflow`<sup>Optional</sup> <a name="buildWorkflow" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.buildWorkflow"></a>

```typescript
public readonly buildWorkflow: BuildWorkflow;
```

- *Type:* projen.build.BuildWorkflow

The PR build GitHub workflow.

`undefined` if `buildWorkflow` is disabled.

---

##### `buildWorkflowJobId`<sup>Optional</sup> <a name="buildWorkflowJobId" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.buildWorkflowJobId"></a>

```typescript
public readonly buildWorkflowJobId: string;
```

- *Type:* string

The job ID of the build workflow.

---

##### `jest`<sup>Optional</sup> <a name="jest" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.jest"></a>

```typescript
public readonly jest: Jest;
```

- *Type:* projen.javascript.Jest

The Jest configuration (if enabled).

---

##### `maxNodeVersion`<sup>Optional</sup> <a name="maxNodeVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.maxNodeVersion"></a>

```typescript
public readonly maxNodeVersion: string;
```

- *Type:* string

Maximum node version required by this pacakge.

---

##### `minNodeVersion`<sup>Optional</sup> <a name="minNodeVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.minNodeVersion"></a>

```typescript
public readonly minNodeVersion: string;
```

- *Type:* string

Minimum node.js version required by this package.

---

##### `npmignore`<sup>Optional</sup> <a name="npmignore" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.npmignore"></a>

```typescript
public readonly npmignore: IgnoreFile;
```

- *Type:* projen.IgnoreFile

The .npmignore file.

---

##### `prettier`<sup>Optional</sup> <a name="prettier" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.prettier"></a>

```typescript
public readonly prettier: Prettier;
```

- *Type:* projen.javascript.Prettier

---

##### ~~`publisher`~~<sup>Optional</sup> <a name="publisher" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.publisher"></a>

- *Deprecated:* use `release.publisher`.

```typescript
public readonly publisher: Publisher;
```

- *Type:* projen.release.Publisher

Package publisher.

This will be `undefined` if the project does not have a release workflow.

---

##### `release`<sup>Optional</sup> <a name="release" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.release"></a>

```typescript
public readonly release: Release;
```

- *Type:* projen.release.Release

Release management.

---

##### `upgradeWorkflow`<sup>Optional</sup> <a name="upgradeWorkflow" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.upgradeWorkflow"></a>

```typescript
public readonly upgradeWorkflow: UpgradeDependencies;
```

- *Type:* projen.javascript.UpgradeDependencies

The upgrade workflow.

---

##### `docsDirectory`<sup>Required</sup> <a name="docsDirectory" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.docsDirectory"></a>

```typescript
public readonly docsDirectory: string;
```

- *Type:* string

---

##### `libdir`<sup>Required</sup> <a name="libdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.libdir"></a>

```typescript
public readonly libdir: string;
```

- *Type:* string

The directory in which compiled .js files reside.

---

##### `srcdir`<sup>Required</sup> <a name="srcdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.srcdir"></a>

```typescript
public readonly srcdir: string;
```

- *Type:* string

The directory in which the .ts sources reside.

---

##### `testdir`<sup>Required</sup> <a name="testdir" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.testdir"></a>

```typescript
public readonly testdir: string;
```

- *Type:* string

The directory in which tests reside.

---

##### `tsconfigDev`<sup>Required</sup> <a name="tsconfigDev" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tsconfigDev"></a>

```typescript
public readonly tsconfigDev: TypescriptConfig;
```

- *Type:* projen.javascript.TypescriptConfig

A typescript configuration file which covers all files (sources, tests, projen).

---

##### `watchTask`<sup>Required</sup> <a name="watchTask" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.watchTask"></a>

```typescript
public readonly watchTask: Task;
```

- *Type:* projen.Task

The "watch" task.

---

##### `docgen`<sup>Optional</sup> <a name="docgen" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.docgen"></a>

```typescript
public readonly docgen: boolean;
```

- *Type:* boolean

---

##### `eslint`<sup>Optional</sup> <a name="eslint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.eslint"></a>

```typescript
public readonly eslint: Eslint;
```

- *Type:* projen.javascript.Eslint

---

##### `tsconfig`<sup>Optional</sup> <a name="tsconfig" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tsconfig"></a>

```typescript
public readonly tsconfig: TypescriptConfig;
```

- *Type:* projen.javascript.TypescriptConfig

---

##### `tsconfigEslint`<sup>Optional</sup> <a name="tsconfigEslint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.tsconfigEslint"></a>

```typescript
public readonly tsconfigEslint: TypescriptConfig;
```

- *Type:* projen.javascript.TypescriptConfig

---

##### `appEntrypoint`<sup>Required</sup> <a name="appEntrypoint" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.appEntrypoint"></a>

```typescript
public readonly appEntrypoint: string;
```

- *Type:* string

The CDK app entrypoint.

---

##### `cdkConfig`<sup>Required</sup> <a name="cdkConfig" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkConfig"></a>

```typescript
public readonly cdkConfig: CdkConfig;
```

- *Type:* projen.awscdk.CdkConfig

cdk.json configuration.

---

##### `cdkDeps`<sup>Required</sup> <a name="cdkDeps" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkDeps"></a>

```typescript
public readonly cdkDeps: AwsCdkDeps;
```

- *Type:* projen.awscdk.AwsCdkDeps

---

##### `cdkTasks`<sup>Required</sup> <a name="cdkTasks" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkTasks"></a>

```typescript
public readonly cdkTasks: CdkTasks;
```

- *Type:* projen.awscdk.CdkTasks

Common CDK tasks.

---

##### `cdkVersion`<sup>Required</sup> <a name="cdkVersion" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.cdkVersion"></a>

```typescript
public readonly cdkVersion: string;
```

- *Type:* string

The CDK version this app is using.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.DEFAULT_TASK">DEFAULT_TASK</a></code> | <code>string</code> | The name of the default task (the task executed when `projen` is run without arguments). |

---

##### `DEFAULT_TASK`<sup>Required</sup> <a name="DEFAULT_TASK" id="@time-loop/clickup-projen.clickupCdk.ClickUpCdkTypeScriptApp.property.DEFAULT_TASK"></a>

```typescript
public readonly DEFAULT_TASK: string;
```

- *Type:* string

The name of the default task (the task executed when `projen` is run without arguments).

Normally this task should synthesize the project files.

---


