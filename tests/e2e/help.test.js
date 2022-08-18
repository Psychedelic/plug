const settingsButtonClick = async (page) => {
  const settingsButton = await page.getByTestId('settings-button', true);
  await settingsButton.click();
};

const helpButtonClick = async (page) => {
  const seedPhraseButton = await page.getByTestId('help', true);
  await seedPhraseButton.click();
};

const closeButtonClick = async (page) => {
  const closeButton = await page.getByTestId('close-button', true);
  await closeButton.click();
};

const helpMenuItemClick = async (page, name) => {
  const helpMenuItem = await page.getByTestId(`help-${name}`, true);
  await helpMenuItem.click();
};

const checkHelpMenuItemLinkMatch = async (browser, page, name, link) => {
  const targetCreationPromise = new Promise((resolve) => browser.once('targetcreated', () => resolve(true)));
  await helpMenuItemClick(page, name);
  const isTargetCreated = await targetCreationPromise;

  if (isTargetCreated) {
    // Manual to load the page after creation, otherwise will fail due to undefined
    await page.waitForTimeout(5000);
    const allPages = await browser.pages();
    const newPage = allPages.slice(-1)[0];
    const url = await newPage?.evaluate(() => document.location.href);
    expect(url).toBe(link);
  } else {
    throw new Error('The page creation event was not triggered');
  }
};

describe('Settings: Help', () => {
  let browser;
  let page;

  const docsData = { item: 'Documentation', url: 'https://docs.plugwallet.ooo/' };
  const blogData = { item: 'Blog', url: 'https://medium.com/plugwallet' };
  const followUsData = { item: 'Follow us on Twitter', url: 'https://twitter.com/plug_wallet' };
  const discordData = { item: 'Join our Discord', url: 'https://discord.com/invite/yVEcEzmrgm' };

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing the account
    page = await utils.createNewPage(browser);
    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);

    await page.close();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.popupUrl);
    await popupPageUtils.profileButtonClick(page);
    await settingsButtonClick(page);
    await helpButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking that close button taken user to main view', async () => {
    await closeButtonClick(page);
    await page.waitForSelector('[data-testid="open-send-view-button"]');
  });

  test('checking that documentation link is match', async () => {
    await checkHelpMenuItemLinkMatch(browser, page, docsData.item, docsData.url);
  });

  test('checking that blog link is match', async () => {
    await checkHelpMenuItemLinkMatch(browser, page, blogData.item, blogData.url);
  });

  test('checking that follow us link is match', async () => {
    await checkHelpMenuItemLinkMatch(browser, page, followUsData.item, followUsData.url);
  });

  test('checking that discord us link is match', async () => {
    await checkHelpMenuItemLinkMatch(browser, page, discordData.item, discordData.url);
  });
});
