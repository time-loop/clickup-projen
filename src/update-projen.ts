import { YamlFile } from 'projen';
import { UpgradeDependencies, UpgradeDependenciesSchedule } from 'projen/lib/javascript';
import { TypeScriptProject } from 'projen/lib/typescript';

export module updateProjen {
  export const UPDATE_PROJEN_PR_LABEL = 'update-projen';
  export const ADD_UPDATE_PROJEN_PROJECT_JOB_NAME = 'add-to-update-projen-project';
  export const GITHUB_UPDATE_PROJEN_PROJECT_NUMBER = '6';

  const addToProjectWorkflow = {
    name: ADD_UPDATE_PROJEN_PROJECT_JOB_NAME,
    on: {
      pull_request: {
        types: ['opened', 'labeled'],
      },
    },
    concurrency: {
      group: '${{ github.workflow }}-${{ github.ref_name }}',
    },
    jobs: {
      // Can't use a variable here?!?
      'add-to-update-projen-project': {
        'runs-on': 'ubuntu-latest',
        permissions: {
          contents: 'read',
        },
        steps: [
          {
            name: 'Add to project',
            uses: 'actions/add-to-project@v0.4.1',
            with: {
              // github project url
              'project-url': `https://github.com/orgs/time-loop/projects/${GITHUB_UPDATE_PROJEN_PROJECT_NUMBER}`,
              'github-token': '${{ secrets.RENOVATEBOT_GITHUB_TOKEN }}',
              labeled: UPDATE_PROJEN_PR_LABEL,
            },
          },
        ],
      },
    },
  };

  export function addWorkflows(project: TypeScriptProject, override?: any): void {
    new UpgradeDependencies(project, {
      include: ['projen', '@time-loop/clickup-projen'],
      pullRequestTitle: 'upgrade projen',
      semanticCommit: 'fix', // let's get this into the changelog.
      taskName: UPDATE_PROJEN_PR_LABEL,
      workflowOptions: {
        schedule: UpgradeDependenciesSchedule.MONTHLY,
        labels: [UPDATE_PROJEN_PR_LABEL],
      },
    });

    new YamlFile(project, `.github/workflows/${ADD_UPDATE_PROJEN_PROJECT_JOB_NAME}.yml`, {
      obj: { ...addToProjectWorkflow, ...override },
    });
  }
}
