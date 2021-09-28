const JsConfigPathsMapper = require('jsconfig-paths-jest-mapper');
const regeneratorRuntime = require("regenerator-runtime");
const chrome = require('sinon-chrome/extensions');
const firefox = require('selenium-webdriver/firefox');
const browser = require('sinon-chrome/webextensions');
const webdriver = require('selenium-webdriver');
const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Options: FirefoxOptions } = require('selenium-webdriver/firefox');
const path = require('path');

const instantiateSeleniumDriver = async () => {
  const seleniumChrome = webdriver.Capabilities.chrome();
  const seleniumFirefox = webdriver.Capabilities.firefox();

  const chromeOptions = new ChromeOptions();
  const firefoxOptions = new FirefoxOptions();

  chromeOptions.addArguments("--load-extension=" + path.resolve(__dirname, 'extension', 'chrome'));
  firefoxOptions.setPreference("xpinstall.signatures.required", false);

  const chromeDriver = new webdriver.Builder()
    .withCapabilities(seleniumChrome)
    .setChromeOptions(chromeOptions)
    .build();

  const firefoxDriver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(firefoxOptions)
    .build();

  //await firefoxDriver.installAddon(path.resolve(__dirname, 'extension', 'firefox.xpi'));

  return [chromeDriver, firefoxDriver];
};

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
    regeneratorRuntime,
    getDrivers: instantiateSeleniumDriver,
    closeDriver: (drivers) => {
      drivers.forEach(driver => driver.quit());
    },
  },
  moduleNameMapper: new JsConfigPathsMapper({ configFileName: "./jsconfig.json" }),
};
