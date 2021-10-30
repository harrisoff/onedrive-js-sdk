export const scope = 'openid https://graph.microsoft.com/Files.ReadWrite.All';
// Files smaller than this will be uploaded directly
export const SMALL_SIZE = 1024 * 1024 * 4;
// Files smaller than this must be split into chunks first
// And those chunks must be uploaded sequentially in order
export const LARGE_SIZE = 1024 * 1024 * 60;
// Chunk size must be a multiple of 320 KiB
// see: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createuploadsession?view=odsp-graph-online#upload-bytes-to-the-upload-session
export const CHUNK_SIZE = 1024 * 320 * 3;
