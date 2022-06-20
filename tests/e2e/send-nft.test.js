// Utilities
const nftsTabButtonClick = async (page) => {
  const nftsTabButton = await page.waitForTestIdSelector('tab-item-NFTs', { visible: true });
  await nftsTabButton.click();
};

const cronicCollectionChevronClick = async (page) => {
  const collectionChevronDownIcon = await page.waitForTestIdSelector('nft-collection-dropdown-icon-Cronic Wearables', { visible: true });
  await collectionChevronDownIcon.click();
};

const cancelButtonClick = async (page) => {
  const cancelButton = await page.waitForTestIdSelector('link-button-text');
  await cancelButton.click();
};

const nftClick = async (page) => {
  const nftIdSpan = await page.waitForTestIdSelector('nft-id-#49312', { visible: true });
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
    await cronicCollectionChevronClick(page);
    await nftClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('canceling the send operation', async () => {
    await cancelButtonClick(page);
    await nftsTabButtonClick(page);
  });

  test('copying nft link to clipboard', async () => {
    const copyLinkButton = await page.waitForTestIdSelector('copy-link-button', { visible: true });
    await copyLinkButton.click();
  });
});
// await page.evaluate((dataInternal) => {
//   // mock clipboard
//   let clipboardText = null;
//   window["navigator"]["clipboard"] = {
//       writeText: text => new Promise(resolve => clipboardText = text),
//       readText: () => new Promise(resolve => resolve(clipboardText)),
//   }
// }
