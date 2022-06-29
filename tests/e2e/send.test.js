const { formatTokenAmount: getTokenAmount } = require('../utils/string');

// Utilities

const getUniversalInputValue = async (page) => {
  const universalInput = await page.waitForTestIdSelector('select-token-input');
  return page.evaluate((input) => input.value, universalInput);
};

const getAvailableAmount = async (page) => {
  const availableAmount = await page.waitForTestIdSelector('available-amount');
  return page.evaluate((element) => element.innerText, availableAmount);
};

const waitForBalanceChange = async (page) => {
  await page.waitForTimeout(30000);
};

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

const cancelButtonClick = async (page) => {
  const cancelButton = await page.waitForTestIdSelector('cancel-button');
  await cancelButton.click();
};

const sendViewButtonClick = async (page) => {
  const sendViewButton = await page.waitForTestIdSelector('open-send-view-button');
  await sendViewButton.click();
};

const continueButtonClick = async (page) => {
  const continueButton = await page.waitForTestIdSelector('continue-button');
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

const selectToken = async (page, tokenName) => {
  const selectTokenButton = await page.getByTestId('select-token-button', true);
  await selectTokenButton.click();

  const menuItem = await page.getByTestId(`select-token-button-${tokenName}`, true);
  await menuItem.click();

  await page.waitForTestIdSelector('select-asset-dialog', { hidden: true });
};

const waitForAmount = async (page) => {
  await page.waitForTimeout(500);
  await cancelButtonClick(page);
  await sendViewButtonClick(page);

  const availableAmountString = await getAvailableAmount(page);
  const amount = getTokenAmount(availableAmountString);

  if (amount <= 0) {
    return waitForAmount(page);
  }

  return amount;
};

const tokenBalanceCheck = async (page, { previousAmount, name }) => {
  const assetAmount = await page.getByTestId(`asset-amount-${name}`, true);
  const assetAmountString = await page.evaluate((element) => element.innerText, assetAmount);

  const newAmount = getTokenAmount(assetAmountString);
  expect(newAmount).toBeLessThan(previousAmount);
};

const recipientPrincipalIdEnter = async (page) => {
  const addressInput = await page.getByTestId('send-to-principalID-input', true);
  await addressInput.click();
  await addressInput.type(secrets.subAccountId);
};

const contactSelect = async (page) => {
  const addressBookIcon = await page.getByTestId('address-book-icon', true);
  await addressBookIcon.click();

  const contactName = await page.getByTestId('contact-name-Test', true);
  await contactName.click();
};

async function pressKey(page, key, numberOfPresses = 4) {
  const array = Array.from(Array(numberOfPresses).keys());

  // eslint-disable-next-line no-unused-vars
  for (const _ of array) {
    await page.keyboard.press(key);
  }
}

async function sendToken(page) {
  await recipientPrincipalIdEnter(page);

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
  const defaultTokenNames = ['ICP', 'Cycles', 'Wrapped ICP'];

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

  test('replacing currency from ICP to USD and vice versa', async () => {
    await sendViewButtonClick(page);
    const swapButton = await page.waitForTestIdSelector('select-token-swap-button');
    await swapButton.click();

    const usdValue = await getUniversalInputValue(page);
    expect(usdValue).toBe('$0.00000 USD');

    await swapButton.click();
    const icpValue = await getUniversalInputValue(page);
    expect(icpValue).toBe('0.00000 ICP');
  });

  test('selecting max value', async () => {
    await sendViewButtonClick(page);
    const amount = await waitForAmount(page);
    expect(amount).toBeGreaterThan(0);
    const maxButton = await page.waitForTestIdSelector('max-button');
    await maxButton.click();
    const inputValue = await getUniversalInputValue(page);
    const availableAmount = await getAvailableAmount(page);

    expect(inputValue).toBe(availableAmount);
  });

  test('cancelling the send operation', async () => {
    await sendViewButtonClick(page);
    await cancelButtonClick(page);
    await sendViewButtonClick(page);
  });

  test('sending tokens', async () => {
    const previousAmounts = [];
    for (const name of defaultTokenNames) {
      await sendViewButtonClick(page);
      const amount = await waitForAmount(page);
      expect(amount).toBeGreaterThan(0);
      await selectToken(page, name);
      const previousAmount = await sendToken(page);
      previousAmounts.push(previousAmount);
      await popupPageUtils.refreshWallet(page);
    }

    await waitForBalanceChange(page);

    for (const [index, name] of defaultTokenNames.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenBalanceCheck(page, { previousAmount, name });
    }
  });
});

describe('Send Custom Tokens', () => {
  let browser;
  let page;
  const customTokenData = [
    { canisterId: secrets.dustCanisterId, name: 'Dust', standard: 'DIP20' },
    { canisterId: secrets.wtcCanisterId, name: 'Wrapped Cycles', standard: 'EXT' },
    { canisterId: secrets.betaCanisterId, name: 'Beta Token', standard: 'DIP20' },
  ];
  const wrongTokenData = [
    { canisterId: secrets.wtcCanisterId, name: 'Wrapped Cycles', standard: 'DIP20' },
    { canisterId: secrets.betaCanisterId, name: 'Beta Token', standard: 'EXT' },
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

    for (const { canisterId, standard } of wrongTokenData) {
      await addCustomTokenTabItemClick(page, 'Custom');
      await fillCanisterIdInput(page, canisterId);
      await tokenStandardItemSelection(page, standard);
      await continueButtonClick(page);
      const tokenIdError = await page.getByTestId('token-error', true);
      const tokenIdErrorText = await page.evaluate((el) => el.textContent, tokenIdError);

      expect(tokenIdErrorText).toBe('Wrong standard. No Token Interface Detected.');

      await addCustomTokenTabItemClick(page, 'Search');
    }
  });

  test('adding custom token', async () => {
    for (const data of customTokenData) {
      await addCustomToken(page, data);
    }
  });

  test('sending custom token', async () => {
    const previousAmounts = [];
    for (const data of customTokenData) {
      await sendViewButtonClick(page);
      await selectToken(page, data.name);
      const previousAmount = await sendToken(page);
      previousAmounts.push(previousAmount);
      await popupPageUtils.refreshWallet(page);
    }

    await waitForBalanceChange(page);

    for (const [index, data] of customTokenData.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenBalanceCheck(page, { previousAmount, name: data.name });
    }
  });

  test('entering wrong custom token canister ID ', async () => {
    await addCustomTokenButtonClick(page);
    await addCustomTokenTabItemClick(page, 'Custom');

    await fillCanisterIdInput(page, secrets.wrongCanisterId);

    const isContinueButtonDisabled = await page.$('[data-testid="continue-button"][disabled]') !== null;
    expect(isContinueButtonDisabled).toBe(true);
  });
});
