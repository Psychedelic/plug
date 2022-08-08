const settingsButtonClick = async (page) => {
  const settingsButton = await page.getByTestId('settings-button', true);
  await settingsButton.click();
};

const seedPhraseButtonClick = async (page) => {
  const seedPhraseButton = await page.getByTestId('secret-recovery-phrase', true);
  await seedPhraseButton.click();
};

const copySeedPhraseBoxClick = async (page) => {
  const seedPhraseBox = await page.getByTestId('seed-phrase-box', true);
  await seedPhraseBox.click();
};

const passwordInputFill = async (page, password) => {
  const passwordInput = await page.getByTestId('password-input', true);
  await passwordInput.click();
  await passwordInput.type(password);
};

const safeCheckboxClick = async (page) => {
  const safeCheckbox = await page.getByTestId('safe-checkbox', true);
  await safeCheckbox.click();
};

const continueButtonClick = async (page) => {
  const continueButton = await page.getByTestId('continue-button', true);
  await continueButton.click();
};

const backButtonClick = async (page) => {
  const backButton = await page.getByTestId('back-button', true);
  await backButton.click();
};

const closeButtonClick = async (page) => {
  const closeButton = await page.getByTestId('close-button', true);
  await closeButton.click();
};

const isContinueButtonDisabled = async (page) => {
  const isContinueButtonDisabledFunc = await page.$('[data-testid="continue-button"][disabled]') !== null;
  expect(isContinueButtonDisabledFunc).toBe(true);
};

describe('Settings: Secret Recovery Phrase', () => {
  let browser;
  let page;
  const wrongPassword = '1234544444';

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing the account
    page = await utils.createNewPage(browser);
    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);

    await page.close();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.popupUrl);
    await popupPageUtils.profileButtonClick(page);
    await settingsButtonClick(page);
    await seedPhraseButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking the continue button is disabled when password input is empty', async () => {
    await safeCheckboxClick(page);
    await continueButtonClick(page);
    await isContinueButtonDisabled(page);
  });

  test('checking that password asking for the second time, when enter password view was leaved', async () => {
    await backButtonClick(page);
    await seedPhraseButtonClick(page);
    await isContinueButtonDisabled(page);
  });

  test('checking that close button taken user to main view', async () => {
    await closeButtonClick(page);
    await page.waitForSelector('[data-testid="open-send-view-button"]');
  });

  test('entering correct password and copying seed phrase to clipboard', async () => {
    await passwordInputFill(page, secrets.password);
    await safeCheckboxClick(page);
    await continueButtonClick(page);
    await copySeedPhraseBoxClick(page);
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedText).toBe(secrets.seedphrase);
  });

  test('entering wrong password', async () => {
    await passwordInputFill(page, wrongPassword);
    await safeCheckboxClick(page);
    await continueButtonClick(page);
    await page.waitForSelector('[data-testid="continue-button"][disabled]');
    await isContinueButtonDisabled(page);
  });
});
