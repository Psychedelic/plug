const PAGE_TITLE = 'Plug';
const CHROME_PATH = require('path').join(__dirname, '..', '..', 'extension', 'chrome');

jest.setTimeout(50000); // in milliseconds

global.setupChrome = async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${CHROME_PATH}`,
      `--load-extension=${CHROME_PATH}`,
      '--enable-automation',
    ],
  });
  const targets = await browser.targets();
  extensionTarget = targets.find(({ _targetInfo }) => _targetInfo.title === PAGE_TITLE);

  const partialExtensionUrl = extensionTarget._targetInfo.url || '';
  const [, , extensionID] = partialExtensionUrl.split('/');

  const baseUrl = `chrome-extension://${extensionID}`;

  global.chromeData = {
    baseUrl,
    optionsUrl: `${baseUrl}/options.html`,
    popupUrl: `${baseUrl}/popup.html`,
  };

  return browser;
}
