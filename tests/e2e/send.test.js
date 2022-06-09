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
  await page.waitForTestIdSelector('select-asset-dialog', { hidden: true });
  const selectTokenButton = await page.getByTestId('select-token-button', true);
  await selectTokenButton.click();
  const menuItem = await page.getByTestId(`select-token-button-${tokenName}`, true);
  await menuItem.click();
};

const getUniversalInputValue = async (page) => {
  const universalInput = await page.waitForTestIdSelector('select-token-input');
  return page.evaluate((input) => input.value, universalInput);
};

const getAvailableICP = async (page) => {
  const availableICP = await page.waitForTestIdSelector('available-amount');
  return page.evaluate((element) => element.innerText, availableICP);
};

const waitForAmount = async (page) => {
  await page.waitForTimeout(500);
  await cancelButtonClick(page);
  await sendViewButtonClick(page);

  const availableICPString = await getAvailableICP(page);
  const amount = getTokenAmount(availableICPString);

  if (amount <= 0) {
    return waitForAmount(page);
  }

  return amount;
};

describe('Send View', () => {
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
    await popupPageUtils.waitForProfileButton(page);
    await sendViewButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('switching between tokens', async () => {
    // TODO: Add assertions
    const tokenNames = ['ICP', 'Cycles', 'Wrapped ICP'];
    const promises = tokenNames.map((name) => selectToken(page, name));
    await Promise.all(promises);
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
    const availableICP = await getAvailableICP(page);

    expect(inputValue).toBe(availableICP);
  });

  test('cancelling the send operation', async () => {
    await cancelButtonClick(page);
    await sendViewButtonClick(page);
  });

  test('sending an ICP', async () => {
    const amount = await waitForAmount(page);
    expect(amount).toBeGreaterThan(0);

    const amountInput = await page.getByTestId('select-token-input');
    const addressInput = await page.getByTestId('send-to-principalID-input');
    await addressInput.click();
    await addressInput.type(secrets.subAccountId);
    await amountInput.click();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('1');
    const continueButton = await page.waitForTestIdSelector('continue-button');
    await continueButton.click();
    const sendButton = await page.waitForTestIdSelector('send-button');
    await sendButton.click();

    await page.waitForTimeout(15000);
    await popupPageUtils.refreshWallet(page);

    const assetAmount = await page.waitForTestIdSelector('asset-amount-ICP');
    const assetAmountString = await page.evaluate((element) => element.innerText, assetAmount);

    const newAmount = getTokenAmount(assetAmountString);
    expect(newAmount).toBeLessThan(amount);
  });
});
