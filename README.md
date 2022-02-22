[![codecov](https://codecov.io/gh/time-loop/clickup-projen/branch/master/graph/badge.svg?token=J9q6IcW8pk)](https://codecov.io/gh/time-loop/clickup-projen)

# clickup-projen

[Projen](https://github.com/projen/projen) project types for ClickUp

## Usage

### ClickUpCdkTypeScriptApp

When creating new cdk apps:

```bash
yarn global add @time-loop/clickup-projen@0.0.1

mkdir my-new-cdk-app
cd my-new-cdk-app
npx projen new --from @time-loop/clickup-projen@0.0.1
```

## What it does

Watch with awe and wonder as projen stamps out a project with

- CDKv2 support with `@time-loop/cdk-library` and `multi-convention-namer` libraries pre-installed for your coding pleasure.
- Full working CI with pre-configured access to private GitHub Packages.
- codecov configs already in place (you will still need to go to codecov and enable the project, then copy-pasta the CODECOV_TOKEN into github secrets).
- Standard prettier and eslint configs.
