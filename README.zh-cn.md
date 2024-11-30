# OneDrive JS SDK

[![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)](https://github.com/microsoft/TypeScript)
[![npm version](https://badge.fury.io/js/@harrisoff%2Fonedrive-js-sdk.svg)](https://www.npmjs.com/package/@harrisoff/onedrive-js-sdk)
![license](https://img.shields.io/npm/l/@harrisoff/onedrive-js-sdk)

本项目封装了 OneDrive 的一小部分 API，仅用于上传文件并生成分享链接。

可以用来搞个网页，比如 [OneDrive 图床](https://github.com/harrisoff/onedrive-image-hosting)。

## 创建应用

打开 [应用注册](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) 页面，点击*新注册*，然后需要填写以下项目：

- 名称

- 受支持的账户类型

   `仅 Microsoft 个人帐户` 就够用了

- 重定向 URI

   比如 `https://localhost:3000/`

注册完成之后，点击左边目录中的*身份验证*，选中`访问令牌(用于隐式流)`并保存。

应用一旦注册完成，就会生成 `应用程序(客户端) ID`，不过不能直接用，还得先验证应用。点击左边的*品牌打造*，然后跟着页面上的指引做就是了。

## 使用

### 授权

这里使用[令牌流](https://docs.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online#token-flow)验证。使用工具函数 `generateAuthUrl` 生成授权链接。

```ts
import { generateAuthUrl } from '@harrisoff/onedrive-js-sdk'

const authUrl = generateAuthUrl('your-client-id', 'your-redirect-uri')
```

> 实际上在原始的 OneDrive API 中还需要一个 `scope` 参数
> 这个值没有必要修改，所以直接设置为了 `openid https://graph.microsoft.com/Files.ReadWrite.All`

重定向回自己的网站后，如果授权成功，url 的 hash 中会有 `access_token`，否则会有错误信息。

### 调用 API

有两种方式

可以直接调用原始的 API：

```ts
import { uploadSmall, createUploadSession, uploadLargeChunk, share, getShareItem } from '@harrisoff/onedrive-js-sdk'
```

也可以使用封装了原始 API 的构造函数：

```ts
import OneDriveAPI from '@harrisoff/onedrive-js-sdk'

const client = new OneDriveApi({ accessToken })
const { id: fileId } = await client.upload(file, filePath)
const { shareId } = await client.share(fileId)
const shareUrl = await client.getShareUrl(shareId)
```

## 开发文档

- [OneDrive API 官方文档](https://docs.microsoft.com/en-us/onedrive/developer/)
- [一些笔记](./NOTES.md)
