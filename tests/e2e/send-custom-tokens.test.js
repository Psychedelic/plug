const { getTokenAmount } = require('../utils/string');

const addCustomTokenButtonClick = async (page) => {
  const addCustomTokenButton = await page.getByTestId('add-custom-token-button', true);
  await addCustomTokenButton.click();
};

const addCustomTokenTabItemClick = async (page, tabName) => {
  const customTokenTab = await page.getByTestId(`tab-item-${tabName}`, true);
  await customTokenTab.click();
};

const fillCanisterIdInput = async (page, canisterId) => {
  const canisterIdInput = await page.getByTestId('token-canister-id-input', true);
  await canisterIdInput.click();
  await canisterIdInput.type(canisterId);
};

const tokenStandardItemSelection = async (page, standard) => {
  const tokenStandardSelect = await page.getByTestId('token-standard-select', true);
  await tokenStandardSelect.click();

  const standardItem = await page.getByTestId(`standard-item-${standard}`, true);
  await standardItem.click();
};

const continueButtonClick = async (page) => {
  const continueButton = await page.getByTestId('continue-button', true);
  await continueButton.click();
};

async function addCustomToken(page, { name, canisterId, standard }) {
  await addCustomTokenButtonClick(page);

  await addCustomTokenTabItemClick(page, 'Custom');

  await fillCanisterIdInput(page, canisterId);

  await tokenStandardItemSelection(page, standard);

  await continueButtonClick(page);

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
  const availableAmount = await page.getByTestId('available-amount', true);
  return page.evaluate((element) => element.innerText, availableAmount);
};

const waitForAmount = async (page) => {
  const availableAmountString = await getAvailableAmount(page);
  const amount = getTokenAmount(availableAmountString);

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

async function pressKey(page, key, numberOfPresses = 4) {
  const array = Array.from(Array(numberOfPresses).keys());

  // eslint-disable-next-line no-restricted-syntax
  for (const data of array) {
    console.log(data);
    // eslint-disable-next-line no-await-in-loop
    await page.keyboard.press(key);
  }
}

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

  await pressKey(page, 'ArrowLeft', 4);
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

  test('entering wrong token standard', async () => {
    await addCustomTokenButtonClick(page);

    for (const { canisterId, standard } of tokenData) {
      await addCustomTokenTabItemClick(page, 'Custom');
      await fillCanisterIdInput(page, canisterId);
      await tokenStandardItemSelection(page, standard === 'EXT' ? 'DIP20' : 'EXT');
      await continueButtonClick(page);
      await page.waitForTestIdSelector('token-error');
      await addCustomTokenTabItemClick(page, 'Search');
    }
  });

  test('adding custom token', async () => {
    for (const data of tokenData) {
      await addCustomToken(page, data);
    }
  });

  test('sending custom token', async () => {
    const previousAmounts = [];
    for (const data of tokenData) {
      const previousAmount = await sendCustomToken(page, data.name);
      previousAmounts.push(previousAmount);
      await popupPageUtils.refreshWallet(page);
    }

    await waitForBalanceChange(page);

    for (const [index, data] of tokenData.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenBalanceCheck(page, { previousAmount, name: data.name });
    }
  });

  test('entering wrong canister ID ', async () => {
    await addCustomTokenButtonClick(page);

    await addCustomTokenTabItemClick(page, 'Custom');

    await fillCanisterIdInput(page, secrets.wrongCanisterId);

    const isContinueButtonDisabled = await page.$('[data-testid="continue-button"][disabled]') !== null;
    expect(isContinueButtonDisabled).toBe(true);
  });
});
