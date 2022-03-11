[![codecov](https://codecov.io/gh/time-loop/clickup-projen/branch/master/graph/badge.svg?token=J9q6IcW8pk)](https://codecov.io/gh/time-loop/clickup-projen)

# clickup-projen

[Projen](https://github.com/projen/projen) project types for ClickUp

[![asciicast](https://asciinema.org/a/471488.svg)](https://asciinema.org/a/471488)

## Usage

These project types formalize a whole bunch of opinions.
You can override things as necessary.
Usually the way to do this is in your `.projenrc.js` file
by passing in the initial options when creating the project.
We use [deepmerge](https://github.com/voodoocreation/ts-deepmerge)
on passed options to keep surprises down.
We don't currently have a clean way of reverting an option to undefined.

### Bootstrapping: Setup GitHub Packages Access

This is the same step required to use `click` or `@time-loop/cdk-library`.
In order to use this package, you need to tell your package manager to find it in GitHub Packages.
The following will tell `npm` / `yarn` / `pnpm` to find `@time-loop/*` libraries
in the GitHub package registry.

Start by creating a [PAT](https://github.com/settings/tokens) in GitHub
(Settings => Developer Settings => Personal access tokens).
It needs to have at least the `read:packages` permission.
You might want to also use this token with the
[gh](https://github.com/cli/cli) command line tool. Up to you.

Add the following to your `~/.npmrc`:

```bash
GITHUB_OWNER="time-loop"
cat <<EOF >>~/.npmrc

//npm.pkg.github.com/:_authToken=ghp_your-github-token
@${GITHUB_OWNER}:registry=https://npm.pkg.github.com/
EOF
```

NOTE: There are also some `@clickup/*` libraries in ye olde `npmjs.com`.

### ClickUpCdkTypeScriptApp

When creating new cdk apps:

```bash
NEW_APP="my-new-cdk-app"
mkdir "$NEW_APP"
cd "$NEW_APP"
projen new --from @time-loop/clickup-projen clickupcdk_clickupcdktypescriptapp
GITHUB_OWNER="time-loop"
gh repo create --private --push --source=. "$GITHUB_OWNER/$NEW_APP"
```

### ClickUpTypeScriptProject

When creating new TypeScript Libraries:

```bash
NEW_LIB="my-new-lib"
mkdir "$NEW_LIB"
cd "$NEW_LIB"
export GITHUB_OWNER="time-loop" # optional, defaults to time-loop, used by clickup-projen for module name prefix
projen new --from @time-loop/clickup-projen clickupts_clickuptypescriptproject
gh repo create --private --push --source=. "$GITHUB_OWNER/$NEW_LIB"
```

## What It Does

Watch with awe and wonder as projen stamps out a project with

- Full working CI with pre-configured access to private GitHub Packages.
- codecov configs already in place.
- Standard prettier and eslint configs.
- For CDK apps, CDKv2 support with `@time-loop/cdk-library`, `cdk-constants`, `cdk-iam-floyd`, `colors` and `multi-convention-namer` libraries pre-installed for your coding pleasure.

## What's Left For You To Do

- Create the repo in GitHub. `gh repo create --private --push --source=. time-loop/my-new-lib` will probably do what you need. Note: the names MUST MATCH.
- Go to codecov.io https://app.codecov.io/gh/time-loop/my-new-lib/settings
  - Activate the repo (big green button).
  - You should probably grab the Badge Markdown and stick it in your top level `README.md` as the first line at the very top of the file. Use the `badge` tab on the left side of the screen to find it. If you do this as a PR rather than just directly committing on the main branch, it will trigger the workflows, which will be helpful later.
  - You will need the `CODECOV_TOKEN` for the next step. It looks like a uuid, for example: `abcdefgh-1234-abcd-1234-a05b70be94b1`
- Update GitHub settings in your new repo.
  - General: https://github.com/time-loop/my-new-lib/settings
    - Pull Requests, allow only squash merging (this helps keep our git history usable, and helps us achieve [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for semver generation)
    - Enable the following:
      - Always suggest updating pull request branches
      - Allow auto-merge
      - Automatically delete head branches
  - Secrets/Actions: https://github.com/time-loop/my-new-lib/settings/secrets/actions
    - Add a _New repository secret_ with the name `CODECOV_TOKEN` and uuid secret from above.
  - Collaborators and Teams: https://github.com/time-loop/my-new-lib/settings/access
    - You MUST either grant `write` to the `cu-infra-svc-git` machine user (who is a member of the `@time-loop/devops` team) OR you can provide your own `PROJEN_GITHUB_TOKEN` with a GitHub PAT
    - Other than the bot user, you should probably avoid granting access directly to users instead of teams.
    - You should probably grant `admin` to your team.
      Otherwise, you should almost certainly grant `admin` to your manager.
    - If this is a `-cdk` repo, please grant `admin` to `@time-loop/devops`.
    - You should probably grant `write` to the `@time-loop/timeloop` team.
  - Branches: https://github.com/time-loop/my-new-lib/settings/branches
    - Confirm that your default branch is `main`. We only use `master` in legacy repos we haven't yet migrated. BLM.
    - Under _Branch protection rules_ click _Add rule_.
      - Branch name pattern: `main` (must match default branch above)
      - Enable the following options:
        - Require a pull request before merging (single approver is fine for most repos)
        - Require status checks to pass before merging
          - Require branches to be up to date before merging
          - NOTE: Until your first PR has been pushed, none of the jobs will have executed. Until they have executed, the GitHub search for them will not be able to find them for you to add them as requirements. If you haven't already created a PR to add that badge to the README.md, you might want to do that now.
          - We usually require the following checks: `build`, `validate pr title`, `codecov/patch`, `codecov/project`.
          - *If you are moving code into a repo*, chances are that it's UT coverage isn't 90+%. In those cases, hold off on requiring the `codecov/*` checks until you have merged your import PR. Otherwise these checks will fail since you will be significantly reducing your coverage from the 100% that the hello-world placeholder starts off with. The default threshold for codecov status checks is 10%. That means you can reduce coverage by up to 10% on a PR before these checks will trigger.
          - Do not require the `Publish CodeCov` job. That job only runs on the `main` branch and is used to update the baseline coverage numbers.
        - Require conversation resolution before merging
        - Include administrators (if you have to break the rules, you have to disable this first)

That's it! Now go write a failing test and some code to make it pass!

## Use Your New Private Library

### Add It To Your App

Now that the GitHub package repo is configured, you can just

```bash
NEW_LIB="my-new-lib"
GITHUB_OWNER="time-loop"
yarn add "@$GITHUB_OWNER/$NEW_LIB" --save
```

## Developing clickup-projen

```bash
NEW_APP="my-new-cdk-app"
mkdir "$NEW_APP"
cd "$NEW_APP"
projen new --from /Users/ahammond/Documents/ClickUp/clickup-projen/dist/js/clickup-projen@0.0.0.jsii.tgz clickupcdk_clickupcdktypescriptapp
```
