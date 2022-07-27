const settingsButtonClick = async (page) => {
  const settingsButton = await page.getByTestId('settings-button', true);
  await settingsButton.click();
};

const seedPhraseButtonClick = async (page) => {
  const seedPhraseButton = await page.getByTestId('secret-recovery-phrase', true);
  await seedPhraseButton.click();
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
  const seedPhraseButton = await page.getByTestId('secret-recovery-phrase', true);
  await seedPhraseButton.click();
};

describe('Settings: Secret Recovery Phrase', () => {
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

  test('checking the enter password view', async () => {

  });
});
