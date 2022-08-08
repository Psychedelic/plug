const fs = require('fs');

const PEM_LOCATION = `${__dirname}/identity.pem`;

const downloadButtonClick = async (page) => {
  const downloadButton = await page.getByTestId('download-button', true);
  await downloadButton.click();
};

const enableDownloadAccess = async (page, path = './tests/e2e') => {
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path,
  });
};

const verifyPEMFile = async (page, filename) => {
  await enableDownloadAccess(page);
  await downloadButtonClick(page);
  await page.waitForTimeout(1000);

  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  } else {
    throw new Error('PEM File does not exists');
  }

  await page.waitForTimeout(1000);
};

const settingsButtonClick = async (page) => {
  const settingsButton = await page.getByTestId('settings-button', true);
  await settingsButton.click();
};

const exportDFXIdentityButtonClick = async (page) => {
  const exportDFXIdentityButton = await page.getByTestId('export-dfx-identity', true);
  await exportDFXIdentityButton.click();
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

const checkIsSubtitleTextMatch = async (page) => {
  const subtitle = await page.getByTestId('subtitle', true);
  const subtitleText = await page.evaluate((el) => el.textContent, subtitle);
  expect(subtitleText).toBe('In order to use your account in DFX, run the following command, using the .pem file download as route.');
};

const copyCommandIconButtonClick = async (page) => {
  const copyCommandIconButton = await page.getByTestId('copy-button', true);
  await copyCommandIconButton.click();
};

const accountSelectClick = async (page) => {
  const accountSelect = await page.getByTestId('account-select', true);
  await accountSelect.click();
};

const accountItemClick = async (page) => {
  const accountItem = await page.getByTestId('select-item-Subaccount', true);
  await accountItem.click();
  await page.waitForTestIdSelector('select-item-Subaccount', { hidden: true });
};

const checkIsAccountNameMatch = async (page) => {
  const accountName = await page.getByTestId('account-name', true);
  const accountNameText = await page.evaluate((el) => el.textContent, accountName);
  expect(accountNameText).toBe('Subaccount');
};

describe('Settings: Export DFX Identity', () => {
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
    await exportDFXIdentityButtonClick(page);
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
    const settingsTitle = await page.getByTestId('settings-title', true);
    const settingsTitleText = await page.evaluate((el) => el.textContent, settingsTitle);
    expect(settingsTitleText).toBe('Settings');
    await exportDFXIdentityButtonClick(page);

    await isContinueButtonDisabled(page);
  });

  test('checking that close button taken user to main view', async () => {
    await closeButtonClick(page);
    await page.waitForSelector('[data-testid="open-send-view-button"]');
  });

  test('entering correct password, downloading .pem file for main account/subaccount and copying command to clipboard', async () => {
    await closeButtonClick(page);
    await popupPageUtils.profileButtonClick(page);
    await popupPageUtils.createSubAccount(page, 'Subaccount');

    await settingsButtonClick(page);
    await exportDFXIdentityButtonClick(page);

    await passwordInputFill(page, secrets.password);
    await safeCheckboxClick(page);
    await continueButtonClick(page);

    await checkIsSubtitleTextMatch(page);

    await verifyPEMFile(page, PEM_LOCATION);

    await accountSelectClick(page);
    await accountItemClick(page);
    await checkIsAccountNameMatch(page);

    await page.waitForTimeout(2000);

    await verifyPEMFile(page, PEM_LOCATION);

    await copyCommandIconButtonClick(page);
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedText).toBe(`dfx identity import <identity name> <route to pem>
dfx identity use <identity name>`);
  });

  test('checking user cannot see the DFX identity when password is incorrect', async () => {
    await passwordInputFill(page, wrongPassword);
    await safeCheckboxClick(page);
    await continueButtonClick(page);
    await page.waitForSelector('[data-testid="continue-button"][disabled]');
    await isContinueButtonDisabled(page);
  });
});
