const { getTokenAmount } = require('../utils/string');

const sendViewCancel = async (page) => {
  const [cancelButtonElement] = await page.getXPathElements('span', 'Cancel');
  await cancelButtonElement.click();
};

const sendViewOpen = async (page) => {
  const [sendButtonElement] = await page.getXPathElements('span', 'Send');
  await sendButtonElement.click();
};

// Utilities

const selectToken = async (page, { currentName, newName }) => {
  const [selectHandle] = await page.getXPathElements('h4', currentName);
  await selectHandle.click();

  const [selectMenuItem] = await page.getXPathElements('li', newName, true);
  await selectMenuItem.click();
};

const getUniversalInputValue = (page) => page.evaluate(() => document.querySelector('.MuiInputBase-input').value);

const getAvailableICP = async (page) => {
  const [availableICPTag] = await page.getXPathElements('span', 'ICP', true);
  return page.evaluate((tag) => tag.innerText, availableICPTag);
};

const waitForAmount = async (page) => {
  await page.waitForTimeout(500);
  await sendViewCancel(page);
  await sendViewOpen(page);

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
    const [sendButtonElement] = await page.getXPathElements('span', 'Send');
    await sendButtonElement.click();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('switching between tokens', async () => {
    await selectToken(page, { currentName: 'ICP', newName: 'Cycles' });
    await page.waitForTimeout(1000);
    await selectToken(page, { currentName: 'XTC', newName: 'Wrapped ICP' });
    await page.waitForTimeout(1000);
    await selectToken(page, { currentName: 'WICP', newName: 'ICP' });
  });

  test('replacing currency from ICP to USD and vice versa', async () => {
    const swapButton = await page.getElement('button.makeStyles-swapIcon-135');
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
    const [maxButton] = await page.getXPathElements('span', 'Max');
    await maxButton.click();
    const inputValue = await getUniversalInputValue(page);
    const availableICP = await getAvailableICP(page);

    expect(inputValue).toBe(availableICP);
  });

  test('cancelling the send operation', async () => {
    await sendViewCancel(page);
    await sendViewOpen(page);
  });

  test('sending an ICP', async () => {
    const amount = await waitForAmount(page);
    expect(amount).toBeGreaterThan(0);

    const [amountInput, addressInput] = await page.getInputs();
    await addressInput.type(secrets.subAccountId);
    await amountInput.focus();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('1');
    const [continueBtn] = await page.getXPathElements('span', 'Continue', true);
    await continueBtn.click();
    const [sendBtn] = await page.getXPathElements('span', 'Send');
    await sendBtn.click();

    await page.waitForTimeout(15000);
    await popupPageUtils.refreshWallet(page);
    await page.waitForTimeout(8000);

    const [availableICPTag] = await page.getXPathElements('span', 'ICP', true);
    const availableICPString = await page.evaluate((tag) => tag.innerText, availableICPTag);

    const newAmount = getTokenAmount(availableICPString);
    expect(newAmount).toBeLessThan(amount);
  });
});
