const regeneratorRuntime = require("regenerator-runtime");
const JsConfigPathsMapper = require('jsconfig-paths-jest-mapper');
const chrome = require('sinon-chrome/extensions');
const browser = require('sinon-chrome/webextensions');

if (!chrome.runtime) chrome.runtime = {};
if (!chrome.runtime.id) chrome.runtime.id = "history-delete";

module.exports = {
  moduleFileExtensions: ["js", "jsx"],
  transform: {
    "^.+\\.jsx?$": "<rootDir>/tests/__setup__/jest.transform.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__setup__/assetsTransformer.js",
    "\\.(css|less)$": "<rootDir>/tests/__setup__/assetsTransformer.js"
  },
  globals: {
    chrome,
    browser,
    regeneratorRuntime
  },
  moduleNameMapper: new JsConfigPathsMapper({ configFileName: "./jsconfig.json" }),
};
