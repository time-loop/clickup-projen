[![codecov](https://codecov.io/gh/time-loop/clickup-projen/branch/main/graph/badge.svg?token=J9q6IcW8pk)](https://codecov.io/gh/time-loop/clickup-projen)

# clickup-projen

[Projen](https://github.com/projen/projen) project types for ClickUp

[![asciicast](https://asciinema.org/a/471488.svg)](https://asciinema.org/a/471488)

## Usage

These project types formalize a whole bunch of opinions.
You can override things as necessary.
Usually the way to do this is in your `.projenrc.ts` file
by passing in the initial options when creating the project.
We use [deepmerge](https://github.com/voodoocreation/ts-deepmerge)
on passed options to keep surprises down.
We don't currently have a clean way of reverting an option to undefined.

### Bootstrapping:

#### Setup GitHub Packages Access

This is the same step required to use `click` or `@time-loop/cdk-library`.
In order to use this package, you need to tell your package manager to find it in GitHub Packages.
The following will tell `npm` / `yarn` / `pnpm` to find `@time-loop/*` libraries
in the GitHub package registry.

Start by creating a [PAT](https://github.com/settings/tokens) in GitHub
(Settings => Developer Settings => Personal access tokens).
It needs to have at least the `read:packages` permission.
You might want to also use this token with the
[gh](https://github.com/cli/cli) command line tool. Up to you.

Execute below shell script to generate your `~/.npmrc`:

```bash
GITHUB_OWNER="time-loop"
cat <<EOF >>~/.npmrc

//npm.pkg.github.com/:_authToken=ghp_paste-your-github-personal-access-token-here
@${GITHUB_OWNER}:registry=https://npm.pkg.github.com/
EOF
```

NOTE: There are also some `@clickup/*` libraries in ye olde `npmjs.com`.

#### NPM

Install the latest NPM version:

```
npm i -g npm@latest
```

#### Node 14.18.0 and up.

Make sure you are using the appropriate node version with `nvm use --lts`.
The lowest acceptable version is `14.18.0`, but you should probably be using the latest LTS.

```
nvm install --lts && npm use --lts.
```

#### Sourcing cdk.context.json

When creating new cdk apps, you will need to copy `cdk.context.json` from `core-cdk`.
To do that, you'll want to keep an up-to-date copy of `core-cdk` around.

```bash
cd "$MY_CODE_DIR"
# either
gh repo clone time-loop/core-cdk
# or...
cd core-cdk
git checkout main
git pull --ff-only
```

#### Repo Naming Conventions

We create cdk construct libraries using `cdk-*` as a prefix.
The goal for construct libraries is to be exceptionally high quality,
with deep test coverage and coverage numbers in the mid to high 90's.
The expectation is that we will be Open Sourcing our construct libraries,
and that you will be putting them on your resume because you are proud of your work.

We create cdk applications using `*-cdk` as a suffix.
A cdk application deploys one pipeline and one or more stacks.
The goal for application repos is to be reasonably thin.
We code patterns and the majority of complexity belongs in our construct libraries.
The application should be assembling the larger building blocks of construct libraries,
while also adding service specific code as necessary.
Complexity in an application is a code-smell.

We do not as yet have a naming convention for TypeScript libraries.

### CdkApp

If you aren't sure, **this is probably what you are here for**.

REMINDER: you should have `$MY_CODE_DIR/core-cdk` checked out and up-to-date before running this.
See above for details

When creating new cdk apps:

```bash
cd "$MY_CODE_DIR"
NEW_APP="my-new-cdk-app"
mkdir "$NEW_APP"
cd "$NEW_APP"
npx projen new --from @time-loop/clickup-projen clickupcdk_clickupcdktypescriptapp
GITHUB_OWNER="time-loop"
cp ../core-cdk/cdk.context.json .
git add cdk.context.json
git commit -m "chore: add cdk.context.json"
gh repo create --private --push --source=. "$GITHUB_OWNER/$NEW_APP"
```

### CdkConstructLibrary

When creating new cdk construct libraries:

```bash
NEW_CDK_LIB='cdk-my-new-library'
mkdir "$NEW_CDK_LIB"
cd "$NEW_CDK_LIB"
export GITHUB_OWNER="time-loop" # optional, defaults to time-loop, used by clickup-projen for module name prefix
projen new --from @time-loop/clickup-projen clickupcdk_clickupcdkconstructlibrary
gh repo create --public --push --source=. "$GITHUB_OWNER/$NEW_CDK_LIB"
```

### TypeScriptLibrary

When creating new TypeScript Libraries:

```bash
NEW_LIB="my-new-lib"
mkdir "$NEW_LIB"
cd "$NEW_LIB"
export GITHUB_OWNER="time-loop" # optional, defaults to time-loop, used by clickup-projen for module name prefix
npx projen new --from @time-loop/clickup-projen clickupts_clickuptypescriptproject
gh repo create --private --push --source=. "$GITHUB_OWNER/$NEW_LIB"
```

If `gh` gives you this error:

```
GraphQL: Resource protected by organization SAML enforcement. You must grant your OAuth token access to this organization. (createRepository)
Authorize in your web browser:  https://github.com/orgs/time-loop/sso?authorization_request=foooo
```

you need to reauthenticate with:

```
$ gh auth login
? What account do you want to log into? GitHub.com
- Logging into github.com
? You're already logged into github.com as XXX. Do you want to re-authenticate? Yes
# open browser and enter the code shown here
```

## What It Does

Watch with awe and wonder as projen stamps out a project with

- Full working CI with pre-configured access to private GitHub Packages.
- codecov configs already in place.
- Standard prettier and eslint configs.
- For CDK apps, CDKv2 support with `@time-loop/cdk-library`, `cdk-constants`, and `multi-convention-namer` libraries pre-installed for your coding pleasure.

## What's Left For You To Do

- Go to codecov.io https://app.codecov.io/gh/time-loop/my-new-repo/settings
  - If this is your first time using CodeCov, you will need to [enable the GitHub private scope in CodeCov](docs/codecov/) before proceeding.
  - Activate the repo (big green button).
  - You should probably grab the Badge Markdown and stick it in your top level `README.md` as the first line at the very top of the file. Use the `badge` tab on the left side of the screen to find it. If you do this as a PR rather than just directly committing on the main branch, it will trigger the workflows, which will be helpful later.
- Secrets/Actions: https://github.com/time-loop/my-new-repo/settings/secrets/actions
  - Add a _New repository secret_ with the name `CODECOV_TOKEN` and a uuid from CodeCov https://app.codecov.io/gh/time-loop/my-new-repo/settings.
- Update GitHub settings in your new repo.
  - General: https://github.com/time-loop/my-new-repo/settings
    - Pull Requests, allow only squash merging (this helps keep our git history usable, and helps us achieve [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for semver generation)
    - Enable the following:
      - Always suggest updating pull request branches
      - Allow auto-merge
      - Automatically delete head branches
  - Collaborators and Teams: https://github.com/time-loop/my-new-repo/settings/access
    - You MUST either grant `write` to the `cu-infra-svc-git` machine user (who is a member of the `@time-loop/devops` team) OR you can provide your own `PROJEN_GITHUB_TOKEN` with a GitHub PAT
    - Other than the bot user, you should probably avoid granting access directly to users, but instead grant to teams.
    - You should probably grant `admin` to your team.
      Otherwise, you should almost certainly grant `admin` to your manager.
    - If this is a `-cdk` repo, please grant `admin` to `@time-loop/devops`.
    - You should probably grant `write` to the `@time-loop/ft_engineering` team (these are full-time engineers).
    - You should probably grant `write` to the `@time-loop/timeloop` team (this is a broader group).
    - Consider granting `write` to the `@time-loop/CONTR_Engineering` team (these are usually contractors). Especially if you are creating a library repo.
  - Branches: https://github.com/time-loop/my-new-repo/settings/branches
    - Confirm that your default branch is `main`. We only use `master` in legacy repos we haven't yet migrated. BLM.
    - Under _Branch protection rules_ click _Add rule_.
      - Branch name pattern: `main` (must match default branch above)
      - Enable the following options:
        - Require a pull request before merging (single approver is fine for most repos)
        - Require status checks to pass before merging
          - Require branches to be up to date before merging
          - NOTE: Until your first PR has been pushed, none of the jobs will have executed. Until they have executed, the GitHub search for them will not be able to find them for you to add them as requirements. If you haven't already created a PR to add that badge to the README.md, you might want to do that now.
          - We usually require the following checks: `build`, `validate pr title`, `codecov/patch`, `codecov/project`.
          - _If you are moving code into a repo_, chances are that it's UT coverage isn't 90+%. In those cases, hold off on requiring the `codecov/*` checks until you have merged your import PR. Otherwise these checks will fail since you will be significantly reducing your coverage from the 100% that the hello-world placeholder starts off with. The default threshold for codecov status checks is 10%. That means you can reduce coverage by up to 10% on a PR before these checks will trigger.
          - Do not require the `Publish CodeCov` job. That job only runs on the `main` branch and is used to update the baseline coverage numbers.
        - Require conversation resolution before merging
        - Include administrators (if you have to break the rules, you have to disable this first)
  - [Enable cdk-diff support](docs/cdk-diff/). Read the docs for this, particularly the warning at the very bottom. The OIDC roles involved don't require a cdk.context.json file and can be deployed with the self-mutation step 1, described next.
  - [Enable cdk.context.json self-mutation](docs/cdk-context-json/). Note this takes 2 steps, and the first one must run to completion before you do the second. Just do the first step here. After your repo is bootstrap'd and your pipeline has run to completion at least once (and deployed OIDC roles), you can follow up with the second step to enable self-mutation.
  NOTE: You can do this instead of the cdk.context.json step below, as long as you comment out ALL your other deploy steps except OIDC role deployers. This is probably the Right Way for us to be bootstrapping repos going forward, but we haven't done it enough to be sure yet.
  - Context JSON - The last step to get the PR builds running is to do something about your `cdk.context.json`. See the above note about self-mutation for a way to avoid doing this entirely.
    - Copy the context JSON from this repository: https://github.com/time-loop/core-cdk/blob/main/cdk.context.json
    - Create a cdk.context.json in your repo at the root level and copy the above contents.
    - Now you PR build and test should successfully run.
  - AWS Resource Tagging: <https://staging.clickup.com/333/v/dc/ad-723897>
    - Review the [CDK Tagging Configuration](https://staging.clickup.com/333/v/dc/ad-757629/ad-2428217) documentation. Note that `cdk-library` includes default values for required tags, but you will need to ensure your tags are set correctly (e.g. confidentiality default is `public`, which is rarely the correct value for a given resource).
    - If not using CDK for your project, review [AWS Resource Tagging](https://staging.clickup.com/333/v/dc/ad-723897) to ensure any AWS resources created by the repository are tagged correctly with required tags. These tags make our lives easier, and are required to meet compliance obligations.

That's it! Now go write a failing test and some code to make it pass!

NOTE: Implementing and using https://github.com/apps/settings would automate most of the above.
We should do this for better compliance.

## Use Your New Private Library

### Add It To Your App

Now that the GitHub package repo is configured,
take a look at the releases workflow. It should be running, or have already run.
Once it completes, you should see a release published in the Releases section,
and a package appear in the Packages section of the GitHub front page for your new repo.
After that, you can either just

```bash
NEW_LIB="my-new-lib"
GITHUB_OWNER="time-loop"
yarn add "@$GITHUB_OWNER/$NEW_LIB" --save
```

Or add your new library in using `projen`.

## Developing clickup-projen

```bash
NEW_APP="my-new-cdk-app"
mkdir "$NEW_APP"
cd "$NEW_APP"
projen new --from /Users/ahammond/Documents/ClickUp/clickup-projen/dist/js/clickup-projen@0.0.0.jsii.tgz clickupcdk_clickupcdktypescriptapp
```

```bash
NEW_CDK_LIB='my-new-cdk-library'
mkdir "$NEW_CDK_LIB"
cd "$NEW_CDK_LIB"
export GITHUB_OWNER="time-loop" # optional, defaults to time-loop, used by clickup-projen for module name prefix
projen new --from /Users/ahammond/Documents/ClickUp/clickup-projen/dist/js/clickup-projen@0.0.0.jsii.tgz clickupcdk_clickupcdkconstructlibrary
```

## Upgrading Dependencies...Quickly

Since there will be many repos which are created as `clickup-projen` based projects, there will be many which utilize the same common dependencies. Even beyond that, sometimes waiting for the dependabot functionality takes too long depending on the frequency at which it's set to run.

Sometimes, we need to push out a dependency to all consuming repos _fast_. Rather than iterating manually through each GitHub repository and executing the `upgrade-main` GitHub Workflow, we can run the `triggerRenovate.sh` script at the root of the repo to trigger a dependency upgrade (via PR) for each repo with a given suffix.

### Requirements

- `gh` [CLI tool is installed](https://cli.github.com/)
- You have access to the GitHub repos in question
- The following env vars be set/passed on execution:
  - `REPO_OWNER`: The organization or author who owns the repository
  - `REPO_SUFFIX`: The suffix of any repository deemed eligible for the upgrade (for example, all repos ending in `-cdk`)

The following are optional variables with defaults:

- `REPO_LIMIT`: The limit to the number of repositories `gh` tool will return
  - Default: `250`

Here is an example:

```bash
> REPO_OWNER='time-loop' REPO_SUFFIX='-cdk' ./triggerRenovate.sh
```
