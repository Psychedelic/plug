const {Builder, By, Key, Capabilities, until} = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
const service = new chrome.ServiceBuilder(path).build();

chrome.setDefaultService(service);

(async function example() {
  let driver = await new Builder()
    .withCapabilities(Capabilities.chrome())
    .build();
  try {
    await driver.get('http://www.google.com/ncr');
  } finally {
    await driver.quit();
  }
})();
