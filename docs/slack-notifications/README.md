# Slack notifications

For compliance purposes we need alerts in slack for all CDK repo changes. By default, all `clickup-projen` repos will post alerts for all commits to the `main` branch of your CDK repo to the [`#eng-cdk-release-alerts` slack channel](https://clickup.enterprise.slack.com/archives/C04KH6EKMJ5).

## Customising the slack webhook channel

If you would like to customise the slack channel your repos alerts get posted to, then you can do the following:
1. Create your alert channel in slack
2. Setup a [new Slack webhook](https://api.slack.com/apps/AB50VMKMF/incoming-webhooks?) for your channel. If you don't have access to this slack app, you can ask the eng-prod or IT team to create the webhook for you and share it via 1password.
3. Add your new webhook URL to your repos action secrets with the secret name `PROJEN_RELEASE_SLACK_WEBHOOK` (it should override the organisation level secret)

## Customising the slack webhook title and body

If you would like to override the [default message title and / or body](https://github.com/time-loop/clickup-projen/blob/03ffb318426fc10d31a4267aa4143bf9000263ec/src/slack-alert.ts#L77-L82) posted in the slack alert, you can set the following configuration in your repos `.projenrc.ts`:
```
// .projenrc.ts
const project = new clickupCdk.ClickUpCdkTypeScriptApp({
  ...rest of props,
  sendSlackWebhookOnReleaseOpts: {
    messageTitle: 'My custom message title',
    messageBody: 'My custom message body',
  }
});
```

Then run `npx projen` and commit the changes.
