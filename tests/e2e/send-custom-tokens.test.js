const { getTokenAmount } = require('../utils/string');

async function addCustomToken(page, { name, canisterId, standard }) {
  const addCustomTokenButton = await page.getByTestId('add-custom-token-button', true);
  await addCustomTokenButton.click();

  const customTokenTab = await page.getByTestId('tab-item-Custom', true);
  await customTokenTab.click();

  const canisterIdInput = await page.getByTestId('token-canister-id-input', true);
  await canisterIdInput.click();
  await canisterIdInput.type(canisterId);

  const tokenStandardSelect = await page.getByTestId('token-standard-select', true);
  await tokenStandardSelect.click();

  const dip20StandardItem = await page.getByTestId(`standard-item-${standard}`, true);
  await dip20StandardItem.click();

  const continueButton = await page.getByTestId('continue-button', true);
  await continueButton.click();

  const addButton = await page.getByTestId('add-button', true);
  await addButton.click();

  const assetTitle = await page.getByTestId(`asset-name-${name}`, true);
  await page.evaluate((el) => el.textContent, assetTitle);
}

const sendViewButtonClick = async (page) => {
  const sendViewButton = await page.getByTestId('open-send-view-button', true);
  await sendViewButton.click();
};

// Utilities
const selectToken = async (page, tokenName) => {
  const selectTokenButton = await page.getByTestId('select-token-button', true);
  await selectTokenButton.click();
  const menuItem = await page.getByTestId(`select-token-button-${tokenName}`, true);
  await menuItem.click();
  await page.waitForTestIdSelector('select-asset-dialog', { hidden: true });
};

const getAvailableAmount = async (page) => {
  const availableICP = await page.getByTestId('available-amount', true);
  return page.evaluate((element) => element.innerText, availableICP);
};

const waitForAmount = async (page) => {
  const availableICPString = await getAvailableAmount(page);
  const amount = getTokenAmount(availableICPString);

  if (amount <= 0) {
    return waitForAmount(page);
  }

  return amount;
};

const waitForBalanceChange = async (page) => {
  await page.waitForTimeout(30000);
};

const tokenBalanceCheck = async (page, { previousAmount, name }) => {
  const assetAmount = await page.getByTestId(`asset-amount-${name}`, true);
  const assetAmountString = await page.evaluate((element) => element.innerText, assetAmount);

  const newAmount = getTokenAmount(assetAmountString);
  expect(newAmount).toBeLessThan(previousAmount);
};

async function sendCustomToken(page, name) {
  await sendViewButtonClick(page);
  await selectToken(page, name);

  const amount = await waitForAmount(page);
  expect(amount).toBeGreaterThan(0);

  const addressInput = await page.getByTestId('send-to-principalID-input', true);
  await addressInput.click();
  await addressInput.type(secrets.subAccountId);

  const amountInput = await page.getByTestId('select-token-input', true);
  await amountInput.click();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.type('1');

  const continueButton = await page.getByTestId('continue-button', true);
  await continueButton.click();
  const sendButton = await page.getByTestId('send-button', true);
  await sendButton.click();
  return amount;
}

describe('Send View', () => {
  let browser;
  let page;
  const tokenData = [
    { canisterId: secrets.dustCanisterId, name: 'Dust', standard: 'DIP20' },
    { canisterId: secrets.wtcCanisterId, name: 'Wrapped Cycles', standard: 'EXT' },
    { canisterId: secrets.betaCanisterId, name: 'Beta Token', standard: 'DIP20' },
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
    await popupPageUtils.waitForProfileButton(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('adding custom token', async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const data of tokenData) {
      // eslint-disable-next-line no-await-in-loop
      await addCustomToken(page, data);
    }
  });

  test('sending custom token', async () => {
    const previousAmounts = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const data of tokenData) {
      // eslint-disable-next-line no-await-in-loop
      const previousAmount = await sendCustomToken(page, data.name);
      previousAmounts.push(previousAmount);
      // eslint-disable-next-line no-await-in-loop
      await popupPageUtils.refreshWallet(page);
    }
    await popupPageUtils.refreshWallet(page);
    await waitForBalanceChange(page);
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, data] of tokenData.entries()) {
      // eslint-disable-next-line no-await-in-loop
      const previousAmount = previousAmounts[index];
      // eslint-disable-next-line no-await-in-loop
      await tokenBalanceCheck(page, { previousAmount, name: data.name });
      // eslint-disable-next-line no-await-in-loop
    }
  });
});
