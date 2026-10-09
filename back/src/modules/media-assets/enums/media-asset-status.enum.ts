/**
 * `pending`: an upload URL was issued but no document uses the file yet.
 * `uploaded`: the file was verified in storage and attached to a document.
 */
export enum MediaAssetStatus {
  Pending = 'pending',
  Uploaded = 'uploaded',
}
