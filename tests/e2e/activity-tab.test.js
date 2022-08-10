const tabClick = async (page, tabName, selector) => {
  const tab = await page.getByTestId(`tab-item-${tabName}`, true);
  await tab.click();
  await page.waitForSelector(selector);
};

describe('Activity Tab', () => {
  let browser;
  let page;
  const tabsData = [
    { tabName: 'Tokens', selector: '[data-testid="asset-name-ICP"]' },
    { tabName: 'Apps', selector: '[data-testid="app-tab-empty-title"]' },
    { tabName: 'NFTs', selector: '[data-testid="nft-collection-dropdown-ICNS"]' },
  ];

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
    await tabClick(page, 'Activity', '[data-testid="activity-item"]');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking that the switching between tabs is work', async () => {
    for (const data of tabsData) {
      await tabClick(page, data);
    }
  });
});
