import {uploadLargeFileChunk, uploadSmallFile, createUploadSession, share, getShareItem} from './api';
import {splitFileIntoChunks, parallel} from './utils';
import {SMALL_SIZE, LARGE_SIZE, CHUNK_SIZE} from './constants';

export * from './helpers'
export * from './api'

type Options = {
	accessToken: string
}
export default class OneDriveApi {
	private accessToken: string;

	constructor({accessToken}: Options) {
		this.accessToken = accessToken;
	}

	/**
	 * Upload file smaller than 4MB
	 * @param file
	 * @param path
	 * @returns
	 */
	private uploadSmallFile(file: File, path: string) {
		return uploadSmallFile(file, path, this.accessToken);
	}

	/**
	 * Generate upload url for files
	 * larger than 4MB and smaller than 60MB
	 * @param filePath
	 * @returns
	 */
	private createUploadSession(filePath: string) {
		return createUploadSession(filePath, this.accessToken);
	}

	/**
	 * Upload file chunks
	 * @param file
	 * @param url
	 * @param range
	 * @returns
	 */
	private uploadLargeFileChunk(
		file: File | Blob,
		url: string,
		range: { start: number; end: number, total: number },
	) {
		return uploadLargeFileChunk(file, url, range);
	}

	/**
	 * Upload files larger than 4MB and smaller than 60MB
	 * @param file 
	 * @param filePath 
	 * @returns 
	 */
	private async uploadLargeFile(file: File | Blob, filePath: string): Promise<{ id: string }> {
		const {uploadUrl} = await this.createUploadSession(filePath);
		const chunks = splitFileIntoChunks(file, CHUNK_SIZE);
		let uploadedChunkSize = 0;
		const tasks = chunks.map(chunk => {
			const range = {
				start: uploadedChunkSize,
				end: uploadedChunkSize + chunk.size - 1,
				total: file.size,
			};
			uploadedChunkSize = range.end + 1;
			return () => this.uploadLargeFileChunk(chunk, uploadUrl, range);
		});
		return new Promise((resolve, reject) => {
			parallel(tasks)
				.then(res => {
					if (res.length === tasks.length) {
						const lastTask = res[res.length - 1];
						if (lastTask && 'id' in lastTask) {
							resolve(lastTask);
						} else {
							// TODO: Are there any useful error messages in the response?
							throw new Error('Upload failed');
						}
					} else {
						throw new Error('Some chunks were failed to upload');
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Upload file. Note that the file size should be smaller than 60MB
	 * @param file
	 * @param filePath
	 * @returns
	 */
	public async upload(file: File, filePath: string) {
		if (file.size < SMALL_SIZE) {
			return this.uploadSmallFile(file, filePath);
		}

		if (file.size < LARGE_SIZE) {
			return this.uploadLargeFile(file, filePath);
		}

		throw new Error('File is too large.');
	}

	public share(fileId: string) {
		return share(fileId, this.accessToken);
	}

	public async getShareUrl(shareId: string) {
		return (await getShareItem(shareId, this.accessToken))['@microsoft.graph.downloadUrl']
	}
}
