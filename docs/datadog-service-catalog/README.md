# datadog-service-catalog feature

This feature allow publish in the datadog service catalog the release information related to your service.

### Pre-requisites

To use this feature you must guarantee following points:

- Your GitHub project must have the **_DD_PROJEN_RELEASE_API_KEY_** secret defined.
- Your GitHub project must have the **_DD_PROJEN_RELEASE_APP_KEY_** secret defined.

> Note: These secrets should be managed at the organization level. We suggest verifying their presence before enabling this feature in your project. If the secrets are not present, the `release` workflow will fail.

## Enable the datadog-service-catalog feature

### Edit your .projenrc.ts

You should include the `serviceCatalogOptions` configuration block in the `.projenrc.ts` as follow

```diff
@@ -1,5 +1,5 @@
 import { core } from '@time-loop/cdk-library';
+import { clickupCdk, datadogServiceCatalog } from '@time-loop/clickup-projen';

 // import { javascript } from 'projen';
 const project = new clickupCdk.ClickUpCdkTypeScriptApp({
@@ -30,6 +30,37 @@ const project = new clickupCdk.ClickUpCdkTypeScriptApp({
   renovatebotOptions: {
     scheduleInterval: ['before 1am on Monday'],
   },
+
+  serviceCatalogOptions: {
+    serviceInfo: [
+      {
+        description: 'infratest service used to validate new features and functionality',
+        tier: 'lower',
+        lifecycle: 'testing',
+        team: 'cloud platform',
+      },
+    ],
+    contacts: [
+      {
+        name: 'Contact name',
+        type: datadogServiceCatalog.SquadContactType.EMAIL,
+        contact: 'contacttest@clickup.com',
+      },
+    ],
+    links: [
+      {
+        name: 'link test',
+        type: datadogServiceCatalog.SquadLinkType.OTHER,
+        url: 'https://test.clickup.com',
+      },
+      {
+        name: 'staging link test',
+        type: datadogServiceCatalog.SquadLinkType.OTHER,
+        url: 'https://staging.clickup.com',
+      },
+    ],
+    serviceTags: { tag1: 'tag1-test', tag2: 'tag2-test' },
+  },
 });
```

> Note: Validate the `serviceCatalogOptions` block definition section.

**Get this committed then run `npx projen` to update the `.github/workflows/release.yml` file**

### serviceCatalogOptions block definition

| field                      | description                                                                                           | required | default                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| serviceCatalogOptions{}    | parent configuration block to enable                                                                  | No       | `undefined`                                      |
| serviceInfo[]              | Information about the service that will be published to the service catalog                           | No       |                                                  |
| serviceInfo[].serviceName  | The name of the service. This must be unique across all services.                                     | No       | `project.name`                                   |
| serviceInfo[].description  | Some details on what this service does                                                                | No       | Not Provided                                     |
| serviceInfo[].application  | The application/product that this service assists                                                     | No       | `clickup`                                        |
| serviceInfo[].team         | Which squad owns this service                                                                         | No       |                                                  |
| serviceInfo[].lifecycle    | Where is this service in the development cycle (`development`, `staging`, `production`, `deprecated`) | No       | Not Provided                                     |
| serviceInfo[].tier         | How important is this service for business functionality (`low`, `medium`, `high`, `critical`)        | No       | `low`                                            |
| serviceInfo[].pagerdutyUrl | The PagerDuty URL for the service.                                                                    | No       | Not Provided                                     |
| contacts[]                 | The list of contacts for the service.                                                                 | No       | `undefined`                                      |
| contacts[].name            | The name of the contact.                                                                              | Yes      |                                                  |
| contacts[].type            | The type of the contact. Acceptable values are: `email`, `slack`, and `microsoft-teams`               | Yes      |                                                  |
| contacts[].contact         | The actual contact information for the contact                                                        | Yes      |                                                  |
| links[]                    | A list of links associated with the service.                                                          | No       | `undefined`                                      |
| links[].name               | The name of the link                                                                                  | Yes      |                                                  |
| links[].type               | The type for the link. Acceptable values are: `doc`, `runbook`, `repo`, `dashboard` and `other`       | Yes      |                                                  |
| links[].url                | The URL of the link.                                                                                  | Yes      |                                                  |
| serviceTags{}              | The list of tags that are associated with the service. Record<string, string>                         | No       | `project`, `release`, `version` and `actor` tags |

### Configure multiple services in the same project.

If your `cdk-project` is managing multiple services, you can include all the related information in the **serviceInfo[]** array as follows:


```diff
@@ -1,5 +1,5 @@
 import { core } from '@time-loop/cdk-library';
+import { clickupCdk, datadogServiceCatalog } from '@time-loop/clickup-projen';

 // import { javascript } from 'projen';
 const project = new clickupCdk.ClickUpCdkTypeScriptApp({
@@ -30,6 +30,37 @@ const project = new clickupCdk.ClickUpCdkTypeScriptApp({
   renovatebotOptions: {
     scheduleInterval: ['before 1am on Monday'],
   },
+
+  serviceCatalogOptions: {
+    serviceInfo: [
+      {
+        serviceName: 'service-name-1',
+        description: 'description of service-name-1',
+        application: 'application-name' #default values clickup',
+        tier: 'lower',
+        lifecycle: 'testing',
+        team: 'cloud platform',
+        pagerdutyUrl: 'https://pagerduty.url.com', #pager duty url 
+      },
+      {
+        serviceName: 'service-name-2',
+        description: 'description of service-name-2',
+        application: 'application-name' #default values clickup',
+        tier: 'critical',
+        lifecycle: 'developing',
+        team: 'other team',
+        pagerdutyUrl: 'https://pagerduty.url.com', #pager duty url 
+      },
+    ],
+    contacts: [
+      {
+        name: 'Contact name',
+        type: datadogServiceCatalog.SquadContactType.EMAIL,
+        contact: 'contacttest@clickup.com',
+      },
+    ],
+    links: [
+      {
+        name: 'link test',
+        type: datadogServiceCatalog.SquadLinkType.OTHER,
+        url: 'https://test.clickup.com',
+      },
+      {
+        name: 'staging link test',
+        type: datadogServiceCatalog.SquadLinkType.OTHER,
+        url: 'https://staging.clickup.com',
+      },
+    ],
+    serviceTags: { tag1: 'tag1-test', tag2: 'tag2-test' },
+  },
 });
```


### Validate the release.yml file

After you have run `npx projen` you will see an additional job in the `.github/workflows/release.yml` called `send_service_catalog` as follow.

```diff
+++ b/.github/workflows/release.yml
@@ -137,3 +137,57 @@ jobs:
           SLACK_FOOTER: ""
           SLACK_COLOR: success
           MSG_MINIMAL: "true"
+  send_service_catalog:
+    name: Send to Datadog Service Catalog
+    needs: release
+    runs-on: ubuntu-latest
+    permissions:
+      contents: read
+    env:
+      CI: "true"
+    if: needs.release.outputs.latest_commit == github.sha
+    steps:
+      - name: Download build artifacts
+        uses: actions/download-artifact@v3
+        with:
+          name: build-artifact
+          path: dist
+      - name: Get version
+        id: event_metadata
+        run: echo "release_tag=$(cat dist/releasetag.txt)" >> $GITHUB_OUTPUT
+      - name: Publish DD Service Catalog for infratest-service-cdk
+        uses: a
+      ...
+      ...
+      # Service information will be here
```


If multiple services have been configured in your project, the release.yml file will show one step per each service following the next name pattern `Publish DD Service Catalog for {serviceName}`

for example:
```diff
+++ b/.github/workflows/release.yml
@@ -137,3 +137,57 @@ jobs:
           SLACK_FOOTER: ""
           SLACK_COLOR: success
           MSG_MINIMAL: "true"
+  send_service_catalog:
+    name: Send to Datadog Service Catalog
+    needs: release
+    runs-on: ubuntu-latest
+    permissions:
+      contents: read
+    env:
+      CI: "true"
+    if: needs.release.outputs.latest_commit == github.sha
+    steps:
+      - name: Download build artifacts
+        uses: actions/download-artifact@v3
+        with:
+          name: build-artifact
+          path: dist
+      - name: Get version
+        id: event_metadata
+        run: echo "release_tag=$(cat dist/releasetag.txt)" >> $GITHUB_OUTPUT
+      - name: Publish DD Service Catalog for service-name-1
+        uses: a
+      ...
+      ...
+      # Service information will be here
+      - name: Publish DD Service Catalog for service-name-2
+        uses: a
+      ...
+      ...
+      # Service information will be here
+      # Service information will be here
+      - name: Publish DD Service Catalog for service-name-3
+        uses: a
+      ...
+      ...
+      # Service information will be here
```