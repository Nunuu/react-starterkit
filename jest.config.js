module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(mjs?|js?)$",
  roots: [
    "<rootDir>/bin/"
  ],
  moduleFileExtensions: [
    "js",
    "mjs"
  ],
  transform: {
    "^.+\\.mjs$": "babel-jest"
  }
};
