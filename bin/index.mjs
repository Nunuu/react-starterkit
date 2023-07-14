#!/usr/bin/env node
import fs from 'fs-extra';
import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const run = async () => {
	const initialized = await createApp();
  if (!initialized) { return; }

	await installPackages();
	await copyTemplates();
	await modifyGitIgnore();
	await addScriptsToPackageJSON();
	await modifyTsConfigCompilerOptions();
	console.log(chalk.green('\n ✅ All done!!!\n'));
};

const createApp = async () => {
  if (!appName) {
		console.log(chalk.yellow('\n🚨 No app name was provided❗\n'));
    console.log(chalk.blue('Run the script in the following format: '));
    console.log(chalk.italic.blue('react-starterkit', 'your-app-name\n'));
    return false;
  }

  const appDirectory = `${process.cwd()}/${appName}`;

  if (fs.existsSync(appDirectory)) {
    console.log(chalk.yellow('\n🚨 A directory with the same name already exists❗\n'));
    console.log(chalk.blue(`Choose a different app name or delete the existing directory: ${appDirectory}\n`));
    return false;
  }

  await shell.exec(`pnpm create vite ${appName} --template react-swc-ts`);

  return true;
};

const installPackages = async () => {
	const packages = [
		'prettier',
		'eslint-config-prettier',
		'jest',
		'ts-jest',
		'ts-node',
		'@types/jest',
		'@testing-library/react',
		'@testing-library/jest-dom',
		'jest-environment-jsdom',
		'@types/testing-library__jest-dom',
		'jest-svg-transformer',
		'identity-obj-proxy',
		'eslint-plugin-jest'
	];

  console.log(chalk.yellow('\n--- ⌛ Installing extra dependencies, this may take a while depending on your Internet connection. ---\n'));

  try {
    await shell.exec(`cd ${appName} && pnpm add -D ${packages.join(' ')}`);
    console.log(chalk.green('\nFinished installing packages'));
  } catch (error) {
    console.log(chalk.red('Error installation packages:', error));
  }
};

const copyTemplates = async () => {
  const templatesDirectory = `${path.dirname(new URL(import.meta.url).pathname)}/../templates/`;
  const destinationDirectory = `${appDirectory}/`;

  console.log(chalk.yellow('\n--- ⌛ Copying template files ---\n'));

  try {
    await fs.copy(templatesDirectory, destinationDirectory);
    console.log(chalk.green('All files copied successfully'));
  } catch (error) {
    console.log(chalk.red('Error copying files:', error));
  }
};

const modifyGitIgnore = async () => {
  const destFile = `${appDirectory}/.gitignore`;
  const linesToRemove = ['.vscode/*', '!.vscode/extensions.json'];
  const linesToAdd = ['# Testing', 'coverage'];

  console.log(chalk.yellow('\n--- ⌛ Modifying .gitignore ---\n'));

  try {
    const data = await fs.readFile(destFile, 'utf8');
    const lines = data.split('\n');
    const modifiedLines = lines.filter((line) => !linesToRemove.includes(line.trim()));
    const modifiedContent = modifiedLines.concat(linesToAdd).join('\n');

    await fs.writeFile(destFile, modifiedContent, 'utf8');

    console.log(chalk.green('Finished modifying gitignore.'));
  } catch (err) {
    console.log(chalk.red('Error modifying .gitignore:', err));
  }
};

const addScriptsToPackageJSON = async() => {
  const packageJSONPath = `${appDirectory}/package.json`;
  const scriptsToAdd = {
    test: 'jest --coverage',
    'test:watch': 'jest --watch'
  };

  console.log(chalk.yellow('\n--- ⌛ Modifying package.json ---\n'));

  try {
    const packageJSON = await fs.readJson(packageJSONPath);

    packageJSON.scripts = {
      ...(packageJSON.scripts || {}),
      ...scriptsToAdd
    };

    await fs.writeJson(packageJSONPath, packageJSON, { spaces: 2 });

    console.log(chalk.green('Scripts added to package.json successfully.'));
  } catch (error) {
    console.log(chalk.red('Error adding scripts to package.json:', error));
  }
}

const modifyTsConfigCompilerOptions = async() => {
	const tsConfigPath = `${appDirectory}/tsconfig.json`;
  const configurationToAdd = `/* Testing */
	  "esModuleInterop": true,\n\n		`;

  console.log(chalk.yellow('\n--- ⌛ Modifying tsconfig.json ---\n'));

  try {
    let tsConfigContent = await fs.readFile(tsConfigPath, 'utf8');

    const lintCommentIndex = tsConfigContent.indexOf('/* Linting */');
    if (lintCommentIndex > -1) {
      tsConfigContent = tsConfigContent.slice(0, lintCommentIndex) + configurationToAdd + tsConfigContent.slice(lintCommentIndex);

      await fs.writeFile(tsConfigPath, tsConfigContent);

      console.log(chalk.green('New configuration added to tsconfig.json successfully.'));
    } else {
      throw new Error('Unable to locate "/* Linting */" comment in tsconfig.json');
    }
  } catch (error) {
    console.log(chalk.red('Error modifying to tsconfig.json:', error));
  }
}

run();
