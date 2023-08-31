import { dirname } from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';


export default async function (meta, ...globPaths) {
	const __dirname = dirname(fileURLToPath(meta.url));

	const paths = await Promise.resolve(globPaths)
		.map(path => {
			const fullPath = `${__dirname}${path}`;
			return glob(fullPath);
		})
		.then(lst => lst.flat());


	while (paths.length) {
		const path = paths.shift();
		console.log(`------------------------------`);
		console.log(`loading "${path}"`);
		console.log(`==============================`);
		await import(path);
	}
}
