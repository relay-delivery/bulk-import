import { dirname, join } from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';


export default async function (meta, ...globPaths) {
	const __dirname = dirname(fileURLToPath(meta.url));

	const paths = await Promise.resolve(globPaths.flat())
		.map(path => {
			const fullPath = join(__dirname, path);
			console.log(`globbing "${fullPath}"`);
			return glob(fullPath);
		})
		.then(lst => lst.flat());

	while (paths.length) {
		const path = paths.shift();

		await import(path)
			.catch(err => {
				console.error(`failed to load "${path}"`);
				console.error(err);
				throw err;
			});
	}
}
