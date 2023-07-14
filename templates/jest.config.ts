import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	"moduleNameMapper": {
		"^.+\\.svg$": "jest-svg-transformer",
		"^.+\\.(css|less|scss)$": "identity-obj-proxy"
	},
	setupFilesAfterEnv: [
		"<rootDir>/setupTests.ts"
 	],
};

export default config;
