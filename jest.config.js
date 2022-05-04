module.exports = {
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jestSetup.js'],
  transform: {
    "node_modules/variables/.js": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ]
};
