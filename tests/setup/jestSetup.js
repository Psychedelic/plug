const { fillSeedPhraseInput } = require('../utils/seed');

require('dotenv').config();

const PAGE_TITLE = 'Plug';
const EXTENSION_PATH = require('path').join(__dirname, '..', '..', 'extension', 'chrome');

jest.setTimeout(600000); // in milliseconds

global.secrets = {
  seedphrase: process.env.SEEDPHRASE,
  mainAccountId: process.env.MAIN_ACCOUNT_ID,
  mainPrincipalId: process.env.MAIN_PRINCIPAL_ID,
  subAccountId: process.env.SUB_ACCOUNT_ID,
  subPrincipalId: process.env.SUB_PRINCIPAL_ID,
  sub4PrincipalId: process.env.SUB4_PRINCIPAL_ID,
  icnsName: process.env.ICNS_NAME,
  password: process.env.PASSWORD,
  dustCanisterId: process.env.DUST_CANISTER_ID,
  betaCanisterId: process.env.BETA_CANISTER_ID,
  wtcCanisterId: process.env.WTC_CANISTER_ID,
  xtcCanisterId: process.env.XTC_CANISTER_ID,
  wicpCanisterId: process.env.WICP_CANISTER_ID,
  testCoinCanisterId: process.env.TEST_COIN_CANISTER_ID,
  wrongAccountId: process.env.WRONG_ACCOUNT_ID,
  wrongCanisterId: process.env.WRONG_CANISTER_ID,
  wrongId: process.env.WRONG_ID,
  wrongICNSName: process.env.WRONG_ICNS_NAME,
  networkName: process.env.NETWORK_NAME,
  hostName: process.env.HOST_NAME,
  canisterID: process.env.CANISTER_ID,
  wrongHostName: process.env.WRONG_HOST_NAME,
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

const sonicNetworkData = [
  { testId: 'network-input-name', value: secrets.networkName },
  { testId: 'network-input-host', value: secrets.hostName },
  { testId: 'network-input-ledgerCanisterId', value: secrets.canisterID },
];

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

  await fillSeedPhraseInput(page, seedphrase);

  const newPasswordInput = await getByTestId(page, 'enter-password-input');
  const confirmPasswordInput = await getByTestId(page, 'confirm-password-input', true);

  await newPasswordInput.click();
  await newPasswordInput.type(password);
  await confirmPasswordInput.click();
  await confirmPasswordInput.type(password);

  const confirmSeedphraseButton = await getByTestId(page, 'confirm-seedphrase-button');
  await confirmSeedphraseButton.click();
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

const profileButtonClick = async (page) => {
  const profileButton = await page.getByTestId('profile-button', true);
  await profileButton.click();
};

const fillNameInput = async (page, name) => {
  const nameInput = await page.getByTestId('create-account-name-input', true);
  await nameInput.click();
  await nameInput.type(name);
};

const createAccountButtonClick = async (page) => {
  const createAccountButton = await getByTestId(page, 'create-account-button', true);
  await createAccountButton.click();
};

const refreshWallet = async (page) => {
  const refreshWalletBtn = await getByTestId(page, 'refresh-wallet-button', true);
  await refreshWalletBtn.click();
};

const createSubAccount = async (page, name) => {
  await createAccountButtonClick(page);
  await fillNameInput(page, name);

  const createAccountSubmitButton = await getByTestId(page, 'create-account-submit-button', true);
  await createAccountSubmitButton.click();

  await page.waitForTestIdSelector('create-account-submit-button', { hidden: true });

  await profileButtonClick(page);

  await page.waitForTestIdSelector(`account-name-${name}`);
};

const inputFill = async (page, testId, value) => {
  const input = await page.getByTestId(testId, true);
  await input.click();
  await input.type(value);
};

const addNetworkButtonClick = async (page) => {
  const addNetworkButton = await page.getByTestId('add-network-button', true);
  await addNetworkButton.click();
};

const addSonicNetwork = async (page) => {
  await addNetworkButtonClick(page);
  for (const data of sonicNetworkData) {
    await inputFill(page, data.testId, data.value);
  }
  await addNetworkButtonClick(page);
};

const optionsPageUtils = {
  importAccount,
  unlock,
};

const popupPageUtils = {
  createSubAccount,
  refreshWallet,
  profileButtonClick,
  fillNameInput,
  createAccountButtonClick,
  addSonicNetwork,
  inputFill,
  addNetworkButtonClick,
};

global.popupPageUtils = popupPageUtils;
global.optionsPageUtils = optionsPageUtils;

global.utils = {
  createNewPage,
  getTestIdSelector,
};
