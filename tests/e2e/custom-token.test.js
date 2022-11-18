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

const addButtonClick = (page) => clickFoundElement(page, 'add-button');
const addCustomTokenButtonClick = (page) => clickFoundElement(page, 'add-custom-token-button');
const tokenSearchInputClick = (page) => clickFoundElement(page, 'token-search-input');
const searchTabClick = (page) => clickFoundElement(page, 'tab-item-Search');
const foundTokenClick = (page, name) => clickFoundElement(page, `custom-token-${name}`);
const deleteTokenButtonClick = (page) => clickFoundElement(page, 'delete-token-button');
const cancelButtonClick = (page) => clickFoundElement(page, 'cancel-button');
const closeButtonClick = (page) => clickFoundElement(page, 'close-button');
const backButtonClick = (page) => clickFoundElement(page, 'back-button');

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
    await addCustomTokenButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('canceling custom token adding', async () => {
    await closeButtonClick(page);
    await addButtonClick(page);
  });

  test('back to the main flow', async () => {
    await backButtonClick(page);
    await addButtonClick(page);
  });

  test('checking search custom token flow', async () => {
    await tokenSearchInputClick(page);
    await page.keyboard.type('pp');
    await addCustomTokenButtonClick(page);
    await page.waitForTestIdSelector('token-canister-id-input');

    await searchTabClick(page);
    await tokenSearchInputClick(page);
    await page.keyboard.type('d');
    await pressKey(page, 'Backspace', 1);
    await page.keyboard.type('d');
    await foundTokenClick(page, 'BOXY DUDE');
    await addButtonClick(page);
    await page.waitForTestIdSelector('asset-name-BOX Token');
    await deleteTokenButtonClick(page);
    await deleteTokenButtonClick(page);
    await page.waitForTestIdSelector('asset-name-BOX Token', { hidden: true });
  });
});
