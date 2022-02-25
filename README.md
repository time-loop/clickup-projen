[![codecov](https://codecov.io/gh/time-loop/clickup-projen/branch/master/graph/badge.svg?token=J9q6IcW8pk)](https://codecov.io/gh/time-loop/clickup-projen)

# clickup-projen

[Projen](https://github.com/projen/projen) project types for ClickUp

[![asciicast](https://asciinema.org/a/471488.svg)](https://asciinema.org/a/471488)

## Usage

### ClickUpCdkTypeScriptApp

When creating new cdk apps:

```bash
yarn global add @time-loop/clickup-projen

mkdir my-new-cdk-app
cd my-new-cdk-app
projen new --from @time-loop/clickup-projen clickupcdk_clickupcdktypescriptapp
gh repo create time-loop/my-new-lib --private --push --source=.
```

### ClickUpTypeScriptProject

When creating new TypeScript Libraries:

```bash
yarn global add @time-loop/clickup-projen

mkdir my-new-lib
cd my-new-lib
projen new --from @time-loop/clickup-projen clickupts_clickuptypescriptproject
gh repo create time-loop/my-new-lib --private --push --source=.
```

## What It Does

Watch with awe and wonder as projen stamps out a project with

- Full working CI with pre-configured access to private GitHub Packages.
- codecov configs already in place.
- Standard prettier and eslint configs.
- For CDK apps, CDKv2 support with `@time-loop/cdk-library`, `cdk-constants`, `cdk-iam-floyd`, `colors` and `multi-convention-namer` libraries pre-installed for your coding pleasure.

## What's Left For You To DO

- Create the repo in GitHub. `gh repo create time-loop/my-new-lib --private --push --source=.` will probably do what you need. Note: the names MUST MATCH.
- Go to codecov.io and enable your new repo. https://app.codecov.io/gh/time-loop/my-new-lib/settings
  - You will need the CODECOV_TOKEN in the next step.
  - You should probably also grab the Badge Markdown and stick it in your top level `README.md`.
- Update GitHub settings in your new repo.
  - Secrets/Actions: https://github.com/time-loop/my-new-lib/settings/secrets/actions
    - Add a _New repository secret_ with the name `CODECOV_TOKEN` and uuid from above.
  - Collaborators and Teams: https://github.com/time-loop/my-new-lib/settings/access
    - You should probably avoid granting access directly to users instead of teams.
    - You should probably grant `admin` to your team.
      Otherwise, you should almost certainly grant `admin` to your manager.
    - You should probably grant `write` to the `@time-loop/timeloop` team.
  - Branches: https://github.com/time-loop/my-new-lib/settings/branches
    - Confirm that your default branch is `main`. We only use `master` in legacy repos we haven't yet migrated. BLM.
    - Under _Branch protection rules_ click _Add rule_.
      - Branch name pattern: `main` (must match default branch above)
      - Enable the following options:
        - Require a pull request before merging (single approver is fine for most repos)
        - Require status checks to pass before merging
          - Require branches to be up to date before merging
          - we usually require the following checks: `build`, `validate pr title`, `codecov/patch`, `codecov/project`.
        - Require conversation resolution before merging
        - Include administrators ()

That's it! Now go write a failing test and some code to make it pass!
