require('dotenv').config();

const PAGE_TITLE = 'Plug';
const EXTENSION_PATH = require('path').join(__dirname, '..', '..', 'extension', 'chrome');

const profileButtonSelector = '[aria-label="Emoji"]';

jest.setTimeout(500000); // in milliseconds

global.secrets = {
  seedphrase: process.env.SEEDPHRASE,
  subAccountId: process.env.SUB_ACCOUNT_ID,
  password: process.env.PASSWORD,
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
  await context.overridePermissions(baseUrl, ['clipboard-write']);

  global.chromeData = {
    baseUrl,
    optionsUrl,
    popupUrl,
  };

  return browser;
};

// General utils

const getXPathElements = async (page, elementType, content, wait = false) => {
  const xPath = `//${elementType}[contains(.,"${content}")]`;

  if (wait) await page.waitForXPath(xPath);
  return page.$x(xPath);
};

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

  await newPasswordInput.type(password);
  await confirmPasswordInput.type(password);

  const submitPasswordButton = await getByTestId(page, 'password-confirmation-button');
  await submitPasswordButton.click();
};

const unlock = async (page, password) => {
  await page.goto(chromeData.popupUrl);

  const popupPasswordInput = await getByTestId(page, 'enter-password-input');
  await popupPasswordInput.type(password);

  const unlockPlugButton = await getByTestId(page, 'unlock-wallet-button');
  await unlockPlugButton.click();
};

// Popup page utils

const waitForProfileButton = (page) => page.waitForSelector(profileButtonSelector);

const refreshWallet = async (page) => {
  await waitForProfileButton(page);

  const profileButton = await page.$(profileButtonSelector);
  await profileButton.click();

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

const switchToSubAccount = async (page, subAccountName) => {
  await page.waitForTimeout(1000);
  const profileButton = await page.$(profileButtonSelector);
  await profileButton.click();

  const [subAccountTab] = await getXPathElements(page, 'h6', subAccountName);
  await subAccountTab.click();

  const [accountIdElement] = await getXPathElements(page, 'h5', subAccountName, true);
  await accountIdElement.click();

  const accountId = await page.evaluate(navigator.clipboard.readText);

  return accountId;
};

const optionsPageUtils = {
  importAccount,
  unlock,
};

const popupPageUtils = {
  createSubAccount,
  switchToSubAccount,
  refreshWallet,
  waitForProfileButton,
};

global.popupPageUtils = popupPageUtils;
global.optionsPageUtils = optionsPageUtils;

global.utils = {
  createNewPage,
  getTestIdSelector,
  focusTestIdElement,
};
