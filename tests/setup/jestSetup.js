require('dotenv').config();

const PAGE_TITLE = 'Plug';
const CHROME_PATH = require('path').join(__dirname, '..', '..', 'extension', 'chrome');

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
    headless: false,
    args: [
      `--disable-extensions-except=${CHROME_PATH}`,
      `--load-extension=${CHROME_PATH}`,
      '--enable-automation',
    ],
  });
  const targets = await browser.targets();
  extensionTarget = targets.find(({ _targetInfo }) => _targetInfo.title === PAGE_TITLE);

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

const waitForRender = async (time) => {
  await new Promise((r) => setTimeout(r, time));
};

const getElements = async (page, selector, wait = false) => {
  if (wait) await page.waitForSelector(selector);
  return page.$$(selector);
};

const getElement = async (page, selector, wait = false) => {
  if (wait) await page.waitForSelector(selector);
  return page.$(selector);
};

const getButtons = (page, wait) => getElements(page, 'button', wait);

const getInputs = (page, wait) => getElements(page, 'input', wait);

const getInputWithIndex = async (page, index, wait) => {
  const inputs = await getInputs(page, wait);
  return inputs[index];
};

const getButtonWithIndex = async (page, index, wait) => {
  const buttons = await getButtons(page, wait);
  return buttons[index];
};

const getXPathElements = async (page, elementType, content, wait = false) => {
  const xPath = `//${elementType}[contains(.,"${content}")]`;

  if (wait) await page.waitForXPath(xPath);
  return page.$x(xPath);
};

const createNewPage = async (browser) => {
  const newPage = await browser.newPage();

  newPage.getElements = (...args) => getElements(newPage, ...args);
  newPage.getElement = (...args) => getElement(newPage, ...args);
  newPage.getButtons = (...args) => getButtons(newPage, ...args);
  newPage.getInputs = (...args) => getInputs(newPage, ...args);
  newPage.getInputWithIndex = (...args) => getInputWithIndex(newPage, ...args);
  newPage.getButtonWithIndex = (...args) => getButtonWithIndex(newPage, ...args);
  newPage.getXPathElements = (...args) => getXPathElements(newPage, ...args);

  return newPage;
};

// Options page utils

const importAccount = async (page, seedphrase, password) => {
  await page.goto(chromeData.optionsUrl);

  const importButton = await getButtonWithIndex(page, 0);
  await importButton.click();

  const seedphraseTextArea = await getElement(page, 'textarea');
  await seedphraseTextArea.type(seedphrase);

  const confirmSeedphraseButton = await getButtonWithIndex(page, 0);
  await confirmSeedphraseButton.click();

  const [passwordInput, confirmPasswordInput] = await getInputs(page);
  await passwordInput.type(password);
  await confirmPasswordInput.type(password);

  const submitPasswordButton = await getButtonWithIndex(page, 0);
  await submitPasswordButton.click();
};

const unlock = async (page, password) => {
  await page.goto(chromeData.popupUrl);

  const popupPasswordInput = await getInputWithIndex(page, 0);
  await popupPasswordInput.type(password);

  const unlockPlugButton = await getButtonWithIndex(page, 0);
  await unlockPlugButton.click();
};

// Popup page utils

const navigateToTab = async (page, tabName, shouldAwait) => {
  const [tabElement] = await getXPathElements(page, 'span', tabName, shouldAwait);
  await tabElement.click();
};

const waitForProfileButton = (page) => page.waitForSelector(profileButtonSelector);

const refreshWallet = async (page) => {
  await waitForProfileButton(page);
  const profileButton = await page.$(profileButtonSelector);

  await profileButton.click();

  const [refreshWalletBtn] = await getXPathElements(page, 'h6', 'Refresh Wallet', true);
  await refreshWalletBtn.click();
};

const createSubAccount = async (page, subAccountName) => {
  await waitForProfileButton(page);
  const profileButton = await page.$(profileButtonSelector);
  await profileButton.click();

  const [createAccountButton] = await getXPathElements(page, 'h6', 'Create Account', true);
  await createAccountButton.click();

  const subAccountNameInput = await getInputWithIndex(page, 0);
  await subAccountNameInput.type(subAccountName);

  const createSubAccountButton = await getButtonWithIndex(page, 11);
  await createSubAccountButton.click();
};

const switchToSubAccount = async (page, subAccountName) => {
  await waitForRender(1000);
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
  navigateToTab,
  waitForProfileButton,
};

global.popupPageUtils = popupPageUtils;
global.optionsPageUtils = optionsPageUtils;

global.utils = {
  createNewPage,
  waitForRender,
};
