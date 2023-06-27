#!/usr/bin/env node
const fs = require('fs');
const shell = require('shelljs');

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;
const templates = require('./templates.cjs');

const run = async () => {
	let success = await createApp();
	if (!success) {
		return false;
	}
	await cdIntoNewApp();
	await installPackages();
	await createTemplates();
	await modifyGitIgnore();
	console.log('All done');
};

const createApp = () => {
	return new Promise((resolve) => {
		if (!appName) {
			console.log('\nNo app name was provided.');
			console.log('\nProvide an app name in the following format: ');
			console.log('\ninit-react-app ', 'app-name\n');
			resolve(false);
		}

		shell.exec(`pnpm create vite ${appName} --template react-swc-ts`, () => {
			resolve(true);
		});
	});
};

const cdIntoNewApp = () => {
	return new Promise((resolve) => {
		shell.exec(`cd ${appName}`, () => {
			resolve();
		});
	});
};

const installPackages = () => {
	return new Promise((resolve) => {
		console.log('\nInstalling prettier, eslint-config-prettier\n');
		shell.exec(`pnpm add -D prettier eslint-config-prettier`, () => {
			console.log('\nFinished installing packages\n');
			resolve();
		});
	});
};

const createTemplates = () => {
	return new Promise((resolve) => {
		const promises = templates.map((fileName) => {
			return new Promise((res) => {
				const dirName = fileName.substring(0, fileName.lastIndexOf('/'));
				if (dirName) {
					const destinationDir = `${appDirectory}/${dirName}`;
					if (!fs.existsSync(destinationDir)) {
						fs.mkdirSync(destinationDir, { recursive: true });
					}
				}

				fs.copyFile(fileName, `${appDirectory}/${fileName}`, (err) => {
					if (err) {
						return console.log(err);
					}
					res();
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve();
		});
	});
};

const modifyGitIgnore = () => {
	const destFile = `${appDirectory}/.gitignore`;
	const linesToRemove = ['.vscode/*', '!.vscode/extensions.json'];
	return new Promise((resolve) => {
		console.log('\nModifying .gitignore\n');
		fs.readFile(destFile, 'utf8', (err, data) => {
			if (err) {
				console.error('Error reading the file:', err);
				resolve(false);
			}

			const lines = data.split('\n');
			const modifiedLines = lines.filter((line) => !linesToRemove.includes(line.trim()));
			const modifiedContent = modifiedLines.join('\n');

			fs.writeFile(destFile, modifiedContent, 'utf8', (err) => {
				if (err) {
					console.error('Error writing to the file:', err);
					resolve(false);
				}
				console.log('\nFinished modifying gitignore\n');
				resolve(true);
			});
		});
	});
};

run();
