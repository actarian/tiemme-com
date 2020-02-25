const { DEFAULT_EXTENSIONS } = require('@babel/core'),
	// applySourceMap = require('vinyl-sourcemaps-apply'),
	babelPresetEnv = require('@babel/preset-env'),
	babelPresetTypescript = require('@babel/preset-typescript'),
	path = require('path'),
	rollup = require('rollup'),
	rollupPluginBabel = require('rollup-plugin-babel'),
	rollupPluginCommonJs = require('@rollup/plugin-commonjs'),
	rollupPluginSourcemaps = require('rollup-plugin-sourcemaps'),
	rollupPluginLicense = require('rollup-plugin-license'),
	rollupPluginNodeResolve = require('@rollup/plugin-node-resolve'),
	rollupPluginTypescript = require('rollup-plugin-typescript2'),
	// rollupPluginTypescript = require('@rollup/plugin-typescript'),
	through2 = require('through2'),
	typescript = require('typescript'),
	vinyl = require('vinyl');

function rollup_(config, item) {
	return through2.obj(function(file, enc, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}
		if (file.isStream()) {
			console.warn('Rollup, Streaming not supported');
			return callback(null, file);
		}
		// enable sourcemap is gulp-sourcemaps plugin is enabled
		const maps = file.sourceMap !== undefined;
		const originalCwd = file.cwd;
		const originalPath = file.path;
		const rollupGenerate = (bundle, output, i) => {
			return bundle.generate(output).then(result => {
				if (!result) {
					return;
				}
				const newFileName = path.basename(output.file);
				const newFilePath = output.file;
				let targetFile;
				if (i > 0) {
					const newFile = new vinyl({
						cwd: file.cwd,
						base: file.base,
						path: newFilePath,
						stat: {
							isFile: () => true,
							isDirectory: () => false,
							isBlockDevice: () => false,
							isCharacterDevice: () => false,
							isSymbolicLink: () => false,
							isFIFO: () => false,
							isSocket: () => false
						}
					});
					targetFile = newFile;
				} else {
					file.path = newFilePath;
					targetFile = file;
				}
				const generated = result.output[0];
				// Pass sourcemap content and metadata to gulp-sourcemaps plugin to handle
				// destination (and custom name) was given, possibly multiple output bundles.
				if (maps) {
					generated.map.file = path.relative(originalCwd, originalPath);
					generated.map.sources = generated.map.sources.map(source => path.relative(originalCwd, source));
				}
				targetFile.contents = Buffer.from(generated.code);
				// apply sourcemap to output file
				if (maps) {
					// applySourceMap(targetFile, generated.map);
				}
				if (i > 0) {
					this.push(targetFile);
				}
			}).catch(error => {
				console.log('Rollup generate error', error);
			});
		};

		rollup.rollup(rollupInput_(item)).then(bundle => {
			const bundles = rollupOutput_(item);
			return Promise.all(bundles.map((output, i) => rollupGenerate(bundle, output, i))).then(complete => {
				callback(null, file);
			});
		}).catch(error => {
			console.log('Rollup bundle error', error);
			throw (error);
		});
	});
}

function rollupInput_(item) {
	let babelTargets;
	if (item.target === 'esm') {
		babelTargets = {
			"esmodules": true
		};
	} else {
		babelTargets = item.target; // 'last 2 version, ie 11';
	}
	const tsconfigDefaults = {
		compilerOptions: {
			target: 'esNext',
			module: 'esNext',
			lib: ["dom", "es2015", "es2016", "es2017"],
			allowJs: true,
			declaration: false,
			sourceMap: true,
			removeComments: true,
		},
		exclude: [
			"./node_modules/*",
			".npm"
		]
	};
	const tsconfigOverride = {
		compilerOptions: {
			target: 'esNext',
			module: 'esNext',
			lib: ["dom", "es2015", "es2016", "es2017"],
			allowJs: true,
			declaration: false,
			sourceMap: true,
			removeComments: true,
		},
		exclude: [
			"./node_modules/*",
			".npm"
		]
	};
	const plugins = [
		// Resolve source maps to the original source
		rollupPluginSourcemaps(),
		/*
		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		// import node modules
		rollupPluginNodeResolve(),
		*/
		/*
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		// import commonJs require;
		rollupPluginCommonJs({
			include: 'node_modules/**',
			exclude: ['node_modules/rxjs/**'],
		}),
		*/
		// Compile TypeScript files
		path.extname(item.input) === '.ts' ? rollupPluginTypescript({
			typescript: typescript,
			tsconfigDefaults: tsconfigDefaults,
			tsconfig: 'tsconfig.json',
			tsconfigOverride: tsconfigOverride,
			rollupCommonJSResolveHack: true,
			clean: true,
			check: false,
		}) : null,
		rollupPluginBabel({
			extensions: [
				...DEFAULT_EXTENSIONS,
				'.ts',
				'.tsx'
			],
			presets: [
				[babelPresetEnv, {
					modules: false,
					loose: true,
					targets: babelTargets
				}],
			],
			plugins: [
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-object-rest-spread'
			],
			exclude: 'node_modules/**',
		}),
		rollupPluginLicense({
			banner: `@license <%= pkg.name %> v<%= pkg.version %>
			(c) <%= moment().format('YYYY') %> <%= pkg.author %>
			License: <%= pkg.license %>`,
		}),
	].filter(x => x);
	input = {
		input: item.input,
		plugins: plugins,
		external: item.external || [],
	};
	return input;
}

function rollupOutput_(item) {
	const input = item.input;
	const output = item.output;
	const outputs = Array.isArray(output) ? output : [output];
	const default_ = {
		format: 'iife',
		name: item.name || null,
		globals: (typeof output === 'object' && output.globals) || item.globals || {},
		sourcemap: true,
		minify: item.minify || false,
	};
	return outputs.map(x => {
		let output = Object.assign({}, default_);
		if (typeof x === 'string') {
			output.file = x;
		} else if (typeof x === 'object') {
			output = Object.assign(output, x);
		}
		output.name = output.name || path.basename(output.file, '.js');
		return output;
	});
}

module.exports = {
	rollup_,
	rollupInput_,
	rollupOutput_,
};
