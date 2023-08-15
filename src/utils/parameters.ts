export interface NodeVersion {
  /**
   * Specify a nodeVersion.
   * @default - should be parameters.PROJEN_NODE_VERSION
   */
  nodeVersion?: string;
}

export class parameters {
  static PROJEN_MIN_ENGINE_NODE_VERSION: string = '14.18.0';
  static PROJEN_NODE_VERSION: string = '16.20.2';
}
