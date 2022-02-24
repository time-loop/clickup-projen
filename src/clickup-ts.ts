import { javascript } from 'projen';

export module clickupTs {
  export const baseDevDeps = [
    'esbuild',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'jsii-release',
    'prettier',
  ];

  export const defaults = {
    authorEmail: 'devops@clickup.com',
    authorName: 'ClickUp',
    authorOrganization: true,
    licensed: false,

    release: true,
    releaseToNpm: true,
    npmRegistryUrl: 'https://npm.pkg.github.com',

    workflowBootstrapSteps: [
      {
        name: 'GitHub Packages authorization',
        run: [
          'cat > .npmrc <<EOF',
          '//npm.pkg.github.com/:_authToken=${{ secrets.ALL_PACKAGE_READ_TOKEN }}',
          '@time-loop:registry=https://npm.pkg.github.com/',
          'EOF',
        ].join('\n'),
      },
    ],

    minNodeVersion: '14.17.0', // Required by @typescript-eslint/eslint-plugin@5.6.0
    workflowNodeVersion: '14.17.0',

    prettier: true,
    prettierOptions: {
      settings: {
        printWidth: 120,
        singleQuote: true,
        trailingComma: javascript.TrailingComma.ALL,
      },
    },

    jestOptions: {
      jestConfig: {
        collectCoverageFrom: ['src/**/*.ts'],
      },
    },
    codeCov: true,
    codeCovTokenSecret: 'CODECOV_TOKEN',
  };
}
