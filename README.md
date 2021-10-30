# OneDrive API

![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)

This is the core lib of [OneDrive Image Hosting](https://github.com/harrisoff/onedrive).

This project wraps a small part of OneDrive's APIs, only for uploading files and creating sharing links.

## Usage

### Setting up Application

First, setting up your application [here](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade), `clientId` and `redirectUri` will be used later.

### Authentication

Here we use [token flow](https://docs.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online#token-flow) in authentication. Use helper function `generateAuthUrl` to generate an auth url and open it.

```ts
import { generateAuthUrl } from '@harrisoff/onedrive-api'

const authUrl = generateAuthUrl('your-client-id', 'your-redirect-uri')
```

> Actually there's another field `scope` is required in the auth url.
> This value is set to `openid https://graph.microsoft.com/Files.ReadWrite.All`
> and is unnecessary to be changed.

After redirecting back to your site, `access_token` will be presented in the url.

### API calls

There are two ways to call APIs.

The original APIs are exported so you can use them directly:

```ts
import { uploadSmall, createUploadSession, uploadLargeChunk, share, getShareUrl } from '@harrisoff/onedrive-api'
```

Or you can use constructor to create a client instance, which wraps the original APIs:

```ts
import OneDriveAPI, { getShareUrl } from '@harrisoff/onedrive-api'

const client = new OneDriveApi({ accessToken })
const { id: fileId } = await client.upload(file, filePath)
const { shareId } = await client.share(fileId)
const sharingLink = getShareUrl(shareId)
```

## TODO List

- [ ] more details about setting up application
- [ ] progress callback
- [ ] test suite

## Development

For more details, see:

- [Official OneDrive API Document](https://docs.microsoft.com/en-us/onedrive/developer/)
- [some notes for my personal reference](./NOTES.md)
