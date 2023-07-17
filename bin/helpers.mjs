import { exec } from 'child_process';

export const executeFunctions = async (functions) => {
	for (const fn of functions) {
		const result = await fn();
		if (result !== true) {
			return false;
		}
	}
	return true;
};

export const tryPnpm = () => {
	return new Promise((resolve) => {
		exec('pnpm -v', (error) => {
			if (error) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
};
