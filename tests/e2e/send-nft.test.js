// Utilities

const fillPrincipalIdInput = async (page, principalID) => {
  const principalIdInput = await page.getByTestId('send-nft-to-principalID-input', true);
  await principalIdInput.click();
  await principalIdInput.type(principalID);
};

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

const nftClick = async (page, id = '49312') => {
  const nftIdSpan = await page.getByTestId(`nft-id-#${id}`, true);
  await nftIdSpan.click();
};

const sendNFTButtonClick = async (page) => {
  const sendNFTButton = await page.getByTestId('send-nft-button', true);
  await sendNFTButton.click();
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

  test('expanding nft ', async () => {
    const newPagePromise = new Promise((x) => browser.once('targetcreated', (target) => x(target.page())));
    const expandNftButton = await page.getByTestId('expand-nft', true);
    await expandNftButton.click();
    await page.waitForTimeout(5000);

    const newPage = await newPagePromise;
    const url = await newPage.evaluate(() => document.location.href);
    expect(url).toBe('https://tde7l-3qaaa-aaaah-qansa-cai.raw.ic0.app/?&tokenid=ylfgf-gykor-uwiaa-aaaaa-b4adm-qaqca-aaycq-a');
  });

  test('entering wrong test ID ', async () => {
    await sendNFTButtonClick(page);
    await fillPrincipalIdInput(page, secrets.wrongId);
    const isContinueButtonDisabled = await page.$('[data-testid="nft-send-continue-button"][disabled]') !== null;
    expect(isContinueButtonDisabled).toBe(true);
  });
  test('back to nft description view', async () => {
    await sendNFTButtonClick(page);
    const backToNftButton = await page.getByTestId('back-to-nft-button', true);
    await backToNftButton.click();
  });
  test('closing the send nft view', async () => {
    await sendNFTButtonClick(page);
    const closeNftViewButton = await page.getByTestId('close-nft-send-button', true);
    await closeNftViewButton.click();
  });

  test('choosing contact from address book and sending nft', async () => {
    await sendNFTButtonClick(page);
    const addressBookIcon = await page.getByTestId('address-book-icon', true);
    await addressBookIcon.click();

    const contactName = await page.getByTestId('contact-name-Sub2', true);
    await contactName.click();
  });

  test('sending nft to subaccount', async () => {
    await sendNFTButtonClick(page);
    await fillPrincipalIdInput(page, secrets.subPrincipalId);

    const sendNftContinueButton = await page.getByTestId('nft-send-continue-button', true);
    await sendNftContinueButton.click();

    const confirmSendingButton = await page.getByTestId('confirmation-button', true);
    await confirmSendingButton.click();

    await page.waitForSelector('nft-collection-dropdown-Cronic Wearables', { hidden: true });
  });
});
