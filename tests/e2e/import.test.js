describe('Import/Create', () => {
  let chromeBrowser;
  let page;

  const importButtonSelector = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthMd > div > div:nth-child(2) > div > div > button';
  const importInputSelector = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div:nth-child(3) > div > div.jss36 > div > textarea';
  const submitImportButtonSelector = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div:nth-child(4) > div > button';
  const passwordInputSelector = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div:nth-child(3) > div > div.jss36 > div > input';
  const confirmPasswordInputSelector = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div:nth-child(4) > div > div.jss36 > div > input';
  const submitPasswordButtonSelector = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div:nth-child(5) > div > button';

  const seedphrase = 'genre noodle program casual volume reduce thumb body cause say rail grid';

  beforeAll(async () => {
    chromeBrowser = await setupChrome();
  });
  
  beforeEach(async () => {
    page = await chromeBrowser.newPage();
    await page.goto(chromeData.optionsUrl);
  });

  afterAll(async () => {
    await chromeBrowser.close();
  });

  test('', async () => {
    await page.click(importButtonSelector);
    await page.waitForSelector(importInputSelector);
    await page.type(importInputSelector, seedphrase);
    await page.click(submitImportButtonSelector);

    await page.waitForSelector(passwordInputSelector);
    await page.type(passwordInputSelector, 'TestPassword123');

    await page.waitForSelector(confirmPasswordInputSelector);
    await page.type(confirmPasswordInputSelector, 'TestPassword123');
    await page.click(submitPasswordButtonSelector);

    await page.screenshot({ path: 'screenshot.png' });

    await page.goto(chromeData.popupUrl);

    await page.screenshot({ path: 'screenshot2.png' });
    expect(2).toBe(2);
  });
});
