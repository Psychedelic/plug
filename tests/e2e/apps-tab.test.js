const tabClick = async (page, tabName) => {
  const tab = await page.getByTestId(`tab-item-${tabName}`, true);
  await tab.click();
};

describe('Contacts', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing and unlocking the account
    page = await utils.createNewPage(browser);

    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);

    await page.close();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.popupUrl);
    await tabClick(page, 'Apps');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking that the switching between tabs is work', async () => {

  });
});
