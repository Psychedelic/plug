const { getTokenAmount } = require('../utils/string');

const cancelButtonClick = async (page) => {
  const cancelButton = await page.waitForTestIdSelector('cancel-button');
  await cancelButton.click();
};

const sendViewButtonClick = async (page) => {
  const sendViewButton = await page.waitForTestIdSelector('open-send-view-button');
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

const getUniversalInputValue = async (page) => {
  const universalInput = await page.waitForTestIdSelector('select-token-input');
  return page.evaluate((input) => input.value, universalInput);
};

const getAvailableAmount = async (page) => {
  const availableAmount = await page.waitForTestIdSelector('available-amount');
  return page.evaluate((element) => element.innerText, availableAmount);
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

const waitForBalanceChange = async (page) => {
  await page.waitForTimeout(30000);
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

  // eslint-disable-next-line no-restricted-syntax
  for (const data of array) {
    console.log(data);
    // eslint-disable-next-line no-await-in-loop
    await page.keyboard.press(key);
  }
}

const sendToken = async (page, tokenName) => {
  await sendViewButtonClick(page);
  await selectToken(page, tokenName);

  const amount = await waitForAmount(page);
  expect(amount).toBeGreaterThan(0);

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
};

describe('Send View', () => {
  let browser;
  let page;
  const tokenNames = ['ICP', 'Cycles', 'Wrapped ICP'];

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
    await sendViewButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('replacing currency from ICP to USD and vice versa', async () => {
    const swapButton = await page.waitForTestIdSelector('select-token-swap-button');
    await swapButton.click();

    const usdValue = await getUniversalInputValue(page);
    expect(usdValue).toBe('$0.00000 USD');

    await swapButton.click();
    const icpValue = await getUniversalInputValue(page);
    expect(icpValue).toBe('0.00000 ICP');
  });

  test('selecting max value', async () => {
    const amount = await waitForAmount(page);
    expect(amount).toBeGreaterThan(0);
    const maxButton = await page.waitForTestIdSelector('max-button');
    await maxButton.click();
    const inputValue = await getUniversalInputValue(page);
    const availableAmount = await getAvailableAmount(page);

    expect(inputValue).toBe(availableAmount);
  });

  test('cancelling the send operation', async () => {
    await cancelButtonClick(page);
    await sendViewButtonClick(page);
  });

  test('sending tokens', async () => {
    const previousAmounts = [];
    for (const data of tokenNames) {
      const previousAmount = await sendToken(page, data.name);
      previousAmounts.push(previousAmount);
      await popupPageUtils.refreshWallet(page);
    }

    await waitForBalanceChange(page);

    for (const [index, name] of tokenNames.entries()) {
      const previousAmount = previousAmounts[index];
      await tokenBalanceCheck(page, { previousAmount, name });
    }
  });
});
