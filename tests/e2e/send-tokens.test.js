const { formatTokenAmount } = require('../utils/string');

const AMOUNT_TO_SEND = 0.0001;

const CONTINUE_BUTTON_DISABLED_TEST_ID = '[data-testid="continue-button"][disabled]';

// Clicks

const clickFoundElement = async (page, testId) => {
  const element = await page.getByTestId(testId, true);
  await element.click();

  return element;
};
const addButtonClick = (page) => clickFoundElement(page, 'add-button');
const addCustomTokenButtonClick = (page) => clickFoundElement(page, 'add-custom-token-button');
const mainPageTabClick = (page, tabName) => clickFoundElement(page, `tab-item-${tabName}`);
const cancelButtonClick = (page) => clickFoundElement(page, 'cancel-button');
const continueButtonClick = (page) => clickFoundElement(page, 'continue-button');
const sendViewButtonClick = (page) => clickFoundElement(page, 'open-send-view-button');
const canisterIdInputClick = (page) => clickFoundElement(page, 'token-canister-id-input');
const selectTokenButtonClick = (page) => clickFoundElement(page, 'select-token-button');
const selectTokenButtonElementClick = (page, tokenName) => clickFoundElement(page, `select-token-button-${tokenName}`);
const sendTokenButtonClick = (page) => clickFoundElement(page, 'send-button');
const selectNetworkButtonClick = (page) => clickFoundElement(page, 'network-selector');
const tokenStandardSelect = (page) => clickFoundElement(page, 'token-standard-select');
const addressInputClick = (page) => clickFoundElement(page, 'send-to-principalID-input');
const addressBookIconClick = (page) => clickFoundElement(page, 'address-book-icon');
const contactNameClick = (page) => clickFoundElement(page, 'contact-name-Subaccount');
const standardItemClick = (page, standard) => clickFoundElement(page, `standard-item-${standard}`);
const selectNetworkCardClick = (page, name) => clickFoundElement(page, `network-card-${name}`);
const selectTokenInputClick = (page) => clickFoundElement(page, 'select-token-input');
const maxButtonClick = (page) => clickFoundElement(page, 'max-button');
const addContactButtonClick = (page) => clickFoundElement(page, 'add-contact-button');
const swapButtonClick = (page) => clickFoundElement(page, 'select-token-swap-button');
const contactNameInputClick = (page) => clickFoundElement(page, 'contact-name-input');
const addContactConfirmButtonClick = (page) => clickFoundElement(page, 'confirm-adding-contact-button');
const selectContactClick = (page) => clickFoundElement(page, 'account-name-Sub');

// Timeouts
const waitForBalanceChange = (page) => page.waitForTimeout(40000);

// Input typings

const fillCanisterIdInput = async (page, canisterId) => {
  const canisterIdInput = await canisterIdInputClick(page);
  await canisterIdInput.type(canisterId);
};

// Other Utilities
const getUniversalInputValue = async (page) => {
  const universalInput = await page.waitForTestIdSelector('select-token-input');
  return page.evaluate((input) => input.value, universalInput);
};

const getAvailableAmount = async (page, shouldFormat = true) => {
  const availableAmountTag = await page.getByTestId('available-amount', true);

  const availableAmountString = await page.evaluate((element) => element.innerText, availableAmountTag);

  return shouldFormat ? formatTokenAmount(availableAmountString) : availableAmountString;
};

const tokenStandardItemSelection = async (page, standard) => {
  await tokenStandardSelect(page);
  await standardItemClick(page, standard);
};

const openSelectNetworkModalButtonClick = async (page, boolean) => {
  await selectNetworkButtonClick(page);
  await page.waitForTestIdSelector('network-selection-modal', { hidden: boolean });
};

async function addCustomToken(page, { name, canisterId, standard }) {
  await addButtonClick(page);
  await addCustomTokenButtonClick(page);
  await mainPageTabClick(page, 'Custom');

  await fillCanisterIdInput(page, canisterId);

  await tokenStandardItemSelection(page, standard);

  await continueButtonClick(page);

  await addButtonClick(page);

  const assetTitle = await page.getByTestId(`asset-name-${name}`, true);
  const assetTitleText = await page.evaluate((el) => el.textContent, assetTitle);
  expect(assetTitleText).toBe(name);
}

const selectToken = async (page, tokenName) => {
  await selectTokenButtonClick(page);
  await selectTokenButtonElementClick(page, tokenName);

  await page.waitForTestIdSelector('select-asset-dialog', { hidden: true });
};

const waitForAmount = async (page) => {
  await page.waitForTimeout(500);
  await popupPageUtils.refreshWallet(page);

  const amount = await getAvailableAmount(page);

  if (amount <= 0) {
    return waitForAmount(page);
  }

  return amount;
};

const tokenBalanceCheck = async (page, { previousAmount, name }) => {
  await popupPageUtils.refreshWallet(page);

  await page.waitForTimeout(1000);

  const assetAmount = await page.getByTestId(`asset-amount-${name}`, true);
  const assetAmountString = await page.evaluate((element) => element.innerText, assetAmount);

  const newAmount = formatTokenAmount(assetAmountString);
  const sentAmount = Number((previousAmount - newAmount).toFixed(4));

  expect(sentAmount).toBe(AMOUNT_TO_SEND);
};

const tokenZeroBalanceCheck = async (page, { name }) => {
  await popupPageUtils.refreshWallet(page);

  const assetAmount = await page.getByTestId(`asset-amount-${name}`, true);
  const assetAmountString = await page.evaluate((element) => element.innerText, assetAmount);

  const newAmount = formatTokenAmount(assetAmountString);

  expect(newAmount).toBe(0.000);
};

const recipientPrincipalIdEnter = async (page, principalID) => {
  const addressInput = await addressInputClick(page);
  await addressInput.type(principalID);
};

const contactSelect = async (page) => {
  await addressBookIconClick(page);
  await contactNameClick(page);
};

async function pressKey(page, key, numberOfPresses = 4) {
  const array = Array.from(Array(numberOfPresses).keys());

  // eslint-disable-next-line no-unused-vars
  for (const _ of array) {
    await page.keyboard.press(key);
  }
}

const fillTokenInput = async (page) => {
  await selectTokenInputClick(page);
  await pressKey(page, 'ArrowRight', 4);
  await pressKey(page, 'ArrowLeft', 2);
  await page.keyboard.type('1');
};

const maxTokensAmountSelect = async (page) => {
  const amount = await waitForAmount(page);
  expect(amount).toBeGreaterThan(0);

  await maxButtonClick(page);

  const inputValue = await getUniversalInputValue(page);
  const availableAmount = await getAvailableAmount(page, false);

  expect(inputValue).toBe(availableAmount);
};

const confirmTokenSend = async (page) => {
  await page.waitForSelector(CONTINUE_BUTTON_DISABLED_TEST_ID, { hidden: true });

  await continueButtonClick(page);

  await sendTokenButtonClick(page);

  await page.waitForTimeout(15000);

  await mainPageTabClick(page, 'Tokens');
};

async function sendToken(page) {
  await fillTokenInput(page);
  await confirmTokenSend(page);
}

async function sendMaxToken(page) {
  await maxTokensAmountSelect(page);
  await confirmTokenSend(page);
}

async function fillSendingInfoAndSendMaxTokenAmount(page, name, recipient, previousAmounts) {
  await selectToken(page, name);
  const previousAmount = await getAvailableAmount(page);

  await recipientPrincipalIdEnter(page, recipient);
  await sendMaxToken(page);
  previousAmounts.push(previousAmount);
  await popupPageUtils.refreshWallet(page);
  await sendViewButtonClick(page);
}

async function fillSendingInfoAndSend(page, name, recipient, previousAmounts) {
  await selectToken(page, name);
  const previousAmount = await getAvailableAmount(page);
  await recipientPrincipalIdEnter(page, recipient);
  await sendToken(page, name);
  previousAmounts.push(previousAmount);
  await popupPageUtils.refreshWallet(page);
  await sendViewButtonClick(page);
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
    await sendViewButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('successfully replacing currency from ICP to USD and vice versa', async () => {
    await swapButtonClick(page);

    const usdValue = await getUniversalInputValue(page);
    expect(usdValue).toBe('$0.00000 USD');

    await swapButtonClick(page);
    const icpValue = await getUniversalInputValue(page);
    expect(icpValue).toBe('0.00000 ICP');
  });

  test('cancelling the send operation', async () => {
    await cancelButtonClick(page);
    await sendViewButtonClick(page);
  });

  test('successfully sending tokens', async () => {
    const previousAmounts = [];
    await waitForAmount(page);

    for (const name of defaultTokenNames) {
      await fillSendingInfoAndSend(page, name, secrets.subPrincipalId, previousAmounts);
    }

    await cancelButtonClick(page);
    await waitForBalanceChange(page);

    for (const [index, name] of defaultTokenNames.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenBalanceCheck(page, { previousAmount, name });
    }
  });

  test('adding contact to address book', async () => {
    await recipientPrincipalIdEnter(page, secrets.sub4PrincipalId);
    await addContactButtonClick(page);

    const contactNameInput = await contactNameInputClick(page);
    await contactNameInput.type('Subaccount');

    await addContactConfirmButtonClick(page);

    await page.waitForTestIdSelector('contact-name-Subaccount');
  });

  test('choosing contact with icns name from address book and sending icp', async () => {
    await waitForAmount(page);
    const previousAmount = await getAvailableAmount(page);
    await contactSelect(page);
    await page.waitForTimeout(100);
    await sendToken(page);
    await popupPageUtils.refreshWallet(page);
    await waitForBalanceChange(page);
    await tokenBalanceCheck(page, { previousAmount, name: defaultTokenNames[0] });
  });

  test('successfully sending max amount of tokens', async () => {
    const previousAmounts = [];
    await waitForAmount(page);

    for (const name of defaultTokenNames) {
      await fillSendingInfoAndSendMaxTokenAmount(page, name, secrets.subPrincipalId, previousAmounts);
    }

    await cancelButtonClick(page);
    await waitForBalanceChange(page);

    for (const [index, name] of defaultTokenNames.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenZeroBalanceCheck(page, { previousAmount, name });
    }
  });
  test('sending tokens back to the main account', async () => {
    await popupPageUtils.profileButtonClick(page);
    await popupPageUtils.createSubAccount(page, 'Sub');
    await selectContactClick(page);

    await sendViewButtonClick(page);

    const previousAmounts = [];
    await waitForAmount(page);

    for (const name of defaultTokenNames) {
      await fillSendingInfoAndSendMaxTokenAmount(page, name, secrets.mainPrincipalId, previousAmounts);
    }

    await cancelButtonClick(page);
    await waitForBalanceChange(page);

    for (const [index, name] of defaultTokenNames.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenZeroBalanceCheck(page, { previousAmount, name });
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
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('entering wrong token standard', async () => {
    await addButtonClick(page);
    await addCustomTokenButtonClick(page);

    for (const { canisterId, standard } of wrongTokenData) {
      await mainPageTabClick(page, 'Custom');
      await fillCanisterIdInput(page, canisterId);
      await tokenStandardItemSelection(page, standard);
      await continueButtonClick(page);
      const tokenIdError = await page.getByTestId('token-error', true);
      const tokenIdErrorText = await page.evaluate((el) => el.textContent, tokenIdError);

      expect(tokenIdErrorText).toBe('Wrong standard. No Token Interface Detected.');

      await mainPageTabClick(page, 'Search');
    }
  });

  test('successfully adding custom token', async () => {
    for (const data of customTokenData) {
      await addCustomToken(page, data);
    }
  });

  test('successfully sending custom token', async () => {
    await sendViewButtonClick(page);
    const previousAmounts = [];
    await waitForAmount(page);

    for (const data of customTokenData) {
      await fillSendingInfoAndSend(page, data.name, secrets.subPrincipalId, previousAmounts);
    }
    await cancelButtonClick(page);
    await waitForBalanceChange(page);

    for (const [index, data] of customTokenData.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenBalanceCheck(page, { previousAmount, name: data.name });
    }
  });

  test('entering wrong custom token canister ID ', async () => {
    await addButtonClick(page);
    await addCustomTokenButtonClick(page);
    await mainPageTabClick(page, 'Custom');

    await fillCanisterIdInput(page, secrets.wrongCanisterId);

    const isContinueButtonDisabled = await page.$(CONTINUE_BUTTON_DISABLED_TEST_ID) !== null;
    expect(isContinueButtonDisabled).toBe(true);
  });
});

describe('Send Custom Tokens on Sonic Network', () => {
  let browser;
  let page;

  const networkName = 'Sonic';

  const customTokenData = [
    { canisterId: secrets.xtcCanisterId, name: 'Cycles', standard: 'DIP20' },
    { canisterId: secrets.wicpCanisterId, name: 'Wrapped ICP', standard: 'DIP20' },
    { canisterId: secrets.testCoinCanisterId, name: 'Test Coin', standard: 'DIP20' },
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
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('successfully adding custom token', async () => {
    await openSelectNetworkModalButtonClick(page, false);
    await popupPageUtils.addSonicNetwork(page);
    await openSelectNetworkModalButtonClick(page, false);
    await selectNetworkCardClick(page, networkName);

    for (const data of customTokenData) {
      await addCustomToken(page, data);
    }
  });

  test('successfully sending custom token', async () => {
    await sendViewButtonClick(page);
    const previousAmounts = [];
    await waitForAmount(page);

    for (const data of customTokenData) {
      await fillSendingInfoAndSend(page, data.name, secrets.subPrincipalId, previousAmounts);
    }
    await cancelButtonClick(page);
    await waitForBalanceChange(page);

    for (const [index, data] of customTokenData.entries()) {
      const previousAmount = previousAmounts[index];

      await tokenBalanceCheck(page, { previousAmount, name: data.name });
    }
  });
});
