/** Why adding a document did or did not create a row. */
export enum CourseDocumentCreateOutcome {
  Created = 'created',
  /** The course already has the maximum number of active documents. */
  LimitReached = 'limit_reached',
  /** The upload is not the caller's pending asset (or was claimed meanwhile). */
  AssetUnavailable = 'asset_unavailable',
}
