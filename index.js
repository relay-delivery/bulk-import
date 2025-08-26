import { dirname, join, relative as makeRelative } from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import Promise from 'bluebird';
import _ from 'lodash';


export default async function (meta, ...globPaths) {
	const returnVal = {};
	const __dirname = dirname(fileURLToPath(meta.url));

	const paths = await Promise.resolve(globPaths.flat())
		.map(path => {
			const fullPath = join(__dirname, path);
			return glob(fullPath);
		})
		.then(lst => lst.flat());

	while (paths.length) {
		const path = paths.shift();
		const relativePath = makeRelative(__dirname, path);
		const relativePathParts = relativePath.split('/');

		const module = await import(path)
			.catch(err => {
				console.error(`failed to load "${path}"`);
				console.error(err);
				process.exit(1);
			});

		_.set(returnVal, relativePathParts, module);
	}

	return returnVal;
}
