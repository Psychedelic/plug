const puppeteer = require('puppeteer');

(async () => {
  const pathToExtension = require('path').join(__dirname, '..', 'extension', 'chrome');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--enable-automation',
    ],
  });

  const PAGE_TITLE = 'Plug';
  const targets = await browser.targets();
  extensionTarget = targets.find(({ _targetInfo }) => _targetInfo.title === PAGE_TITLE);

  const partialExtensionUrl = extensionTarget._targetInfo.url || '';
  const [, , extensionID] = partialExtensionUrl.split('/');
  console.log('Extension id ->', extensionID);
  const extensionUrl = `chrome-extension://${extensionID}/options.html`;

  const page = await browser.newPage();
  await page.goto(extensionUrl);
  await page.screenshot({ path: 'screenshot.png' });

  const btnSelector = "#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthMd > div > div:nth-child(2) > div > div > button";
  await Promise.all([
    page.click(btnSelector),
  ]);
  await page.screenshot({ path: 'screenshot2.png' });
  

  await browser.close();
})();
