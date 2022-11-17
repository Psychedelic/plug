const CONTINUE_BUTTON_DISABLED_TEST_ID = '[data-testid="continue-button"][disabled]';

// Clicks
async function pressKey(page, key, numberOfPresses = 4) {
  const array = Array.from(Array(numberOfPresses).keys());

  // eslint-disable-next-line no-unused-vars
  for (const _ of array) {
    await page.keyboard.press(key);
  }
}

const clickFoundElement = async (page, testId) => {
  const element = await page.getByTestId(testId, true);
  await element.click();

  return element;
};

const addCustomNFTButtonClick = (page) => clickFoundElement(page, 'add-custom-nft-button');
const nftCanisterIDInputClick = (page) => clickFoundElement(page, 'nft-canister-id-input');
const closeButtonClick = (page) => clickFoundElement(page, 'close-button');
const backButtonClick = (page) => clickFoundElement(page, 'back-button');
const continueButtonClick = (page) => clickFoundElement(page, 'continue-button');
const addButtonClick = (page) => clickFoundElement(page, 'add-button');
const nftsTabClick = (page) => clickFoundElement(page, 'tab-item-NFTs');

describe('Add Custom NFT', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing and unlocking the accoun
    page = await utils.createNewPage(browser);

    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);

    await page.close();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.popupUrl);
    await addButtonClick(page);
    await addCustomNFTButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('canceling custom nft adding', async () => {
    await closeButtonClick(page);
    await addButtonClick(page);
  });

  test('back to the main flow', async () => {
    await backButtonClick(page);
    await addButtonClick(page);
  });

  test('checking that continue button disabled if entered canister is wrong', async () => {
    const canisterIdInput = await nftCanisterIDInputClick(page);
    await canisterIdInput.type(secrets.wrongNFTCanisterID);
    await page.waitForSelector(CONTINUE_BUTTON_DISABLED_TEST_ID);
  });

  test('checking that continue button disabled if canister input is empty', async () => {
    await nftCanisterIDInputClick(page);
    await page.keyboard.type('1');
    await pressKey(page, 'Backspace', 1);
    await page.waitForSelector(CONTINUE_BUTTON_DISABLED_TEST_ID);
  });
  test('adding the custom nft collection sucessfully', async () => {
    const canisterIdInput = await nftCanisterIDInputClick(page);
    await canisterIdInput.type(secrets.nftCanisterID);
    await continueButtonClick(page);
    await addButtonClick(page);
    await nftsTabClick(page);
  });
});
