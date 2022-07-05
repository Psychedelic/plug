require('dotenv').config();

const PAGE_TITLE = 'Plug';
const EXTENSION_PATH = require('path').join(__dirname, '..', '..', 'extension', 'chrome');

const profileButtonSelector = '[aria-label="Emoji"]';

jest.setTimeout(60000); // in milliseconds

global.secrets = {
  seedphrase: process.env.SEEDPHRASE,
  subAccountId: process.env.SUB_ACCOUNT_ID,
  password: process.env.PASSWORD,
  wrongId: process.env.WRONG_ID,
  dustCanisterId: process.env.DUST_CANISTER_ID,
  betaCanisterId: process.env.BETA_CANISTER_ID,
  wtcCanisterId: process.env.WTC_CANISTER_ID,
  wrongCanisterId: process.env.WRONG_CANISTER_ID,
};

const grantRawPermissions = async (context, url, permissions) => {
  // @ts-ignore
  await context._connection.send('Browser.grantPermissions', {
    origin: url,
    // @ts-ignore
    browserContextId: context._id,
    permissions,
  });
};

global.setupChrome = async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: false, // Can only run extension in head-full mode.
    devtools: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--enable-automation',
    ],

  });
  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => _targetInfo.title === PAGE_TITLE);
  const partialExtensionUrl = extensionTarget._targetInfo.url || '';
  const [, , extensionID] = partialExtensionUrl.split('/');

  const baseUrl = `chrome-extension://${extensionID}`;
  const optionsUrl = `${baseUrl}/options.html`;
  const popupUrl = `${baseUrl}/popup.html`;

  const context = browser.defaultBrowserContext();
  // Please read https://github.com/dom111/code-sandbox/blob/fffd2aa9ae9250acaeeb03e516ca25e6fec5cafb/tests/lib/grantClipboardPermissions.ts#L18
  // In order to understand why grantRawPermissions was used
  await grantRawPermissions(context, baseUrl, ['clipboardReadWrite', 'clipboardSanitizedWrite']);

  global.chromeData = {
    baseUrl,
    optionsUrl,
    popupUrl,
  };

  return browser;
};

// General utils

const getTestIdSelector = (id) => `[data-testid="${id}"]`;

const waitForTestIdSelector = (page, id, ...otherOptions) => {
  const selector = getTestIdSelector(id);
  return page.waitForSelector(selector, ...otherOptions);
};

const getByTestId = async (page, id, shouldWait = false, ...waitOptions) => {
  const selector = getTestIdSelector(id);
  if (shouldWait) {
    await page.waitForSelector(selector, ...waitOptions);
  }
  return page.$(selector);
};

const createNewPage = async (browser) => {
  const newPage = await browser.newPage();

  newPage.getByTestId = (...args) => getByTestId(newPage, ...args);
  newPage.waitForTestIdSelector = (...args) => waitForTestIdSelector(newPage, ...args);

  return newPage;
};

// Options page utils

const importAccount = async (page, seedphrase, password) => {
  await page.goto(chromeData.optionsUrl);

  const importButton = await getByTestId(page, 'import-wallet-button');
  await importButton.click();

  const seedphraseTextArea = await getByTestId(page, 'seedphrase-input');
  await seedphraseTextArea.click();
  await seedphraseTextArea.type(seedphrase);

  const confirmSeedphraseButton = await getByTestId(page, 'confirm-seedphrase-button');
  await confirmSeedphraseButton.click();

  const newPasswordInput = await getByTestId(page, 'new-password-input');
  const confirmPasswordInput = await getByTestId(page, 'confirm-password-input');

  await newPasswordInput.click();
  await newPasswordInput.type(password);
  await confirmPasswordInput.click();
  await confirmPasswordInput.type(password);

  const submitPasswordButton = await getByTestId(page, 'password-confirmation-button');
  await submitPasswordButton.click();
};

const unlock = async (page, password) => {
  await page.goto(chromeData.popupUrl);

  const popupPasswordInput = await getByTestId(page, 'enter-password-input', true);
  await popupPasswordInput.click();
  await popupPasswordInput.type(password);

  const unlockPlugButton = await getByTestId(page, 'unlock-wallet-button');
  await unlockPlugButton.click();
};

// Popup page utils

const waitForProfileButton = (page) => page.waitForSelector(profileButtonSelector);

const ProfileButtonClick = async (page) => {
  const profileButton = await waitForProfileButton(page);
  await profileButton.click();
};

const refreshWallet = async (page) => {
  await waitForProfileButton(page);

  const profileButton = await page.$(profileButtonSelector);
  await profileButton.click();

  await page.waitForSelector('[data-testid="drawer"][aria-hidden="true"]', { hidden: true });

  const refreshWalletBtn = await getByTestId(page, 'refresh-wallet-button', true);
  await refreshWalletBtn.click();
};

const createSubAccount = async (page, subAccountName) => {
  await waitForProfileButton(page);
  const profileButton = await page.$(profileButtonSelector);
  await profileButton.click();

  const createAccountButton = await getByTestId(page, 'create-account-button', true);
  await createAccountButton.click();

  const createAccountNameInput = await getByTestId(page, 'create-account-name-input');
  await createAccountNameInput.type(subAccountName);

  const createAccountSubmitButton = await getByTestId(page, 'create-account-submit-button');
  await createAccountSubmitButton.click();
};

const optionsPageUtils = {
  importAccount,
  unlock,
};

const popupPageUtils = {
  createSubAccount,
  refreshWallet,
  waitForProfileButton,
};

global.popupPageUtils = popupPageUtils;
global.optionsPageUtils = optionsPageUtils;

global.utils = {
  createNewPage,
  getTestIdSelector,
};
