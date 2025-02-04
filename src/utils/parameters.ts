/**
 * Currently we just use these to track node versions.
 * https://nodejs.org/en/about/previous-releases
 */
export class parameters {
  // This should always be the oldest version which is still in maintenance.
  // This will ONLY drive the package.json minimum node version
  static PROJEN_MIN_ENGINE_NODE_VERSION: string = '18.17.1';

  // This should be updated occasionally to the latest release of the current active version.
  // This will drive all the other node versions throughout the system.
  static PROJEN_NODE_VERSION: string = '22.13.1';

  // This should be updated occasionally to the latest release of the current active version.
  static PROJEN_PNPM_VERSION: string = '9.15.5';
}
