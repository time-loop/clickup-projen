# datadog-service-catalog feature

This feature allow publish in the datadog service catalog the release information related to your service. 

### Pre-requisites

To use this feature you must guarantee following points: 
- Your GitHub project must have the ***DATADOG_API_KEY*** secret defined.
- Your GitHub project must have the ***DATADOG_APPLICATION_KEY*** secret defined.

> Note: The organization should define those secrets, but we suggest verifying them before enabling this feature in your project. 


## Enable the datadog-service-catalog feature

### Edit your .projenrc.ts

You should include the `serviceCatalogOptions` configuration block in the  `.projenrc.ts` as follow

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
+    squadContacts: [
+      {
+        name: 'Contact name',
+        type: datadogServiceCatalog.SquadContactType.EMAIL,
+        contact: 'contacttest@clickup.com',
+      },
+    ],
+    squadLinks: [
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

**Get this committed then run `npx projen` to update the `.github/workflowa/release.yml` file**

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
| squadContacts[]            | The list of contacts for the service.                                                                 | No       | `undefined`                                      |
| squadContacts[].name       | The name of the contact.                                                                              | Yes      |                                                  |
| squadContacts[].type       | The type of the contact. Acceptable values are: `email`, `slack`, and `microsoft-teams`               | Yes      |                                                  |
| squadContacts[].contact    | The actual contact information for the contact                                                        | Yes      |                                                  |
| squadLinks[]               | A list of links associated with the service.                                                          | No       | `undefined`                                      |
| squadLinks[].name          | The name of the link                                                                                  | Yes      |                                                  |
| squadLinks[].type          | The type for the link. Acceptable values are: `doc`, `runbook`, `repo`, `dashboard` and `other`       | Yes      |                                                  |
| squadLinks[].url           | The URL of the link.                                                                                  | Yes      |                                                  |
| serviceTags{}              | The list of tags that are associated with the service.  Record<string, string>                        | No       | `project`, `release`, `version` and `actor` tags |



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