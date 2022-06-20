// Utilities
const nftsTabButtonClick = async (page) => {
  const nftsTabButton = await page.getByTestId('tab-item-NFTs', true);
  await nftsTabButton.click();
};

const nftCollectionDropdownClick = async (page, collectionName = 'Cronic Wearables') => {
  const collectionButton = await page.getByTestId(`nft-collection-dropdown-${collectionName}`, true);
  await collectionButton.click();
  await page.waitForSelector('[aria-expanded="true"]');
};

const backButtonClick = async (page) => {
  const cancelButton = await page.getByTestId('link-button-text', true);
  await cancelButton.click();
};

const nftClick = async (page) => {
  const nftIdSpan = await page.getByTestId('nft-id-#49312', true);
  await nftIdSpan.click();
};

describe('NFTs Send View', () => {
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
    await popupPageUtils.waitForProfileButton(page);
    await nftsTabButtonClick(page);
    await nftCollectionDropdownClick(page);
    await page.waitForTimeout(500);
    await nftClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('canceling the send operation', async () => {
    await backButtonClick(page);
    await nftsTabButtonClick(page);
  });

  test('copying nft link to clipboard', async () => {
    const copyLinkButton = await page.getByTestId('copy-link-button', true);
    await copyLinkButton.click();

    const copiedText = await page.evaluate(() => navigator.clipboard.readText());

    expect(copiedText).toBe('https://tde7l-3qaaa-aaaah-qansa-cai.raw.ic0.app/?&tokenid=ylfgf-gykor-uwiaa-aaaaa-b4adm-qaqca-aaycq-a');
  });
});
