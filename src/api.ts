import request from './request';

export function uploadSmallFile(file: File, fullPath: string, token: string) {
	return request.put<unknown, { id: string }>(
		`https://graph.microsoft.com/v1.0/me/drive/root:/${fullPath}:/content`,
		file,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
}

export function createUploadSession(fullPath: string, token: string) {
	return request.post<
		unknown,
		{
			expirationDateTime: string;
			uploadUrl: string;
		}>(
			`https://graph.microsoft.com/v1.0/drive/root:/${fullPath}:/createUploadSession`,
			null,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			},
		);
}

export function uploadLargeFileChunk(
	file: File | Blob,
	uploadUrl: string,
	range: { start: number; end: number, total: number },
) {
	const { start, end, total } = range;
	return request.put<
		unknown,
		{
			expirationDateTime: string;
		} | {
			id: string
		}
	>(
		uploadUrl,
		file,
		{
			headers: {
				'Content-Range': `bytes ${start}-${end}/${total}`,
			},
		},
	);
}

export function share(fileId: string, token: string) {
	return request.post<unknown, { shareId: string }>(
		`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`,
		{
			type: 'view',
			scope: 'anonymous',
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		},
	);
}
