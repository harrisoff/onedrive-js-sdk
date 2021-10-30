export function splitFileIntoChunks(file: File | Blob, chunkSize: number) {
	const chunks = [];
	let offset = 0;
	let chunk = file.slice(offset, offset + chunkSize);
	chunks.push(chunk);
	while (chunk.size) {
		offset += chunkSize;
		chunk = file.slice(offset, offset + chunkSize);
		if (chunk.size) {
			chunks.push(chunk);
		}
	}

	return chunks;
}

/**
 * Run promises one after another
 * @param promises
 * @returns
 */
export const parallel = <T = any>(promises: (() => Promise<T>)[]) => promises.reduce(
	(promiseChain, currentTask) => promiseChain.then(chainResults => currentTask().then(currentResult => [...chainResults, currentResult])),
	Promise.resolve([] as T[]),
);
