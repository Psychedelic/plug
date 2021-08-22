const assert = require('assert');
const webdriver = require('selenium-webdriver');
const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');

function encode(file) {
  var stream = fs.readFileSync(file);
  return new Buffer.from(stream).toString('base64');
}

/*
  const chrome = webdriver.Capabilities.chrome()
  const chromeOptions = new Options();

  const encodedCRX = encode(path.resolve(__dirname, '..', 'extension', 'opera.crx'))
  chromeOptions.addArguments("--load-extension=" + path.resolve(__dirname, '..', 'extension', 'chrome'));

  driver = new webdriver.Builder()
    .withCapabilities(chrome)
    .setChromeOptions(chromeOptions)
    .build();
*/

/*
  this.timeout(10000);

  await driver.get('chrome-extension://cohinjcejkglcocbjgadilaagoelogdh/options.html');

  const title = await driver.getTitle();
  assert.equal(title, 'Plug');

  driver.quit();
*/

/*
  driver.quit();
*/

describe('Inpage', async () => {
  let driver;

  before(() => {
    const chrome = webdriver.Capabilities.chrome()
    const chromeOptions = new Options();

    const encodedCRX = encode(path.resolve(__dirname, '..', 'extension', 'opera.crx'))
    chromeOptions.addArguments("--load-extension=" + path.resolve(__dirname, '..', 'extension', 'chrome'));

    driver = new webdriver.Builder()
      .withCapabilities(chrome)
      .setChromeOptions(chromeOptions)
      .build();
  });

  it('test case should work', async function() {
    this.timeout(10000);

    await driver.get('chrome-extension://cohinjcejkglcocbjgadilaagoelogdh/options.html');

    const title = await driver.getTitle();
    assert.equal(title, 'Plug');
  });

  after(() => {
    driver.quit();
  });
});
