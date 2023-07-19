export class parameters {
  static PROJEN_MIN_ENGINE_NODE_VERSION: string = '14.18.0';
  static PROJEN_NODE_VERSION: string = '16.20.0';
}

export class defaultServiceCatalogValues {
  static SERVICE_VERSION: string = '2.1';
  static DATADOG_HOSTNAME: string = 'app.datadoghq.com';
  static DATADOG_KEY: string = '${{ secrets.DATADOG_API_KEY }}';
  static DATADOG_APP_KEY: string = '${{ secrets.DATADOG_APPLICATION_KEY }}';
  static SLACK_SUPPORT_CHANNEL: string = 'https://click-up.slack.com/archives/C043T0JBJKY';
  static APPLICATION: string = 'clickup';
  static TIER: string = 'low';
  static NOT_PROVIDED: string = 'Not Provided';
}
