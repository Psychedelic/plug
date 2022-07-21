const editAccountButtonClick = async (page, name) => {
  const editAccountButton = await page.getByTestId(`edit-button-${name}`, true);
  // Evaluate used, because bounding box of element couldn't've been found
  await editAccountButton.evaluate((b) => b.click());
};

const editAccountIconButtonClick = async (page) => {
  const editAccountIconButton = await page.getByTestId('edit-icon-button', true);
  await editAccountIconButton.click();
};

const saveChangesIconButtonClick = async (page) => {
  const saveChangesIconButton = await page.getByTestId('save-changes-icon-button', true);
  await saveChangesIconButton.click();
};

const fillNameInput = async (page, symbols) => {
  const nameInput = await page.getByTestId('account-name-input', true);
  await nameInput.click();
  await nameInput.type(symbols);
};

const getWalletName = async (page) => {
  const walletName = await page.getByTestId('wallet-name', true);
  const walletNameText = await page.evaluate((el) => el.textContent, walletName);
  return walletNameText;
};

const ICNSSwitchClick = async (page) => {
  const ICNSSwitch = await page.getByTestId('icns-switch', true);
  await ICNSSwitch.click();
};

const isICNSSelectorHidden = async (page) => {
  await page.waitForTestIdSelector('icns-selector-text', { hidden: true });
};

const understandButtonClick = async (page, name) => {
  const understandButton = await page.getByTestId(`understand-${name}-button`, true);
  await understandButton.click();
  await page.waitForTestIdSelector(`understand-${name}-button`, { hidden: true });
};

const openSelectionModalButtonClick = async (page) => {
  const openSelectionModalButton = await page.getByTestId('open-selection-modal-button', true);
  await openSelectionModalButton.click();
};

const selectICNSNameClick = async (page, icnsName) => {
  const selectICNSName = await page.getByTestId(`icns-name-${icnsName}`, true);
  await selectICNSName.click();
};

const viewAdditionalInfoButtonClick = async (page) => {
  const viewAdditionalInfoButton = await page.getByTestId('view-more-button', true);
  await viewAdditionalInfoButton.click();
};

const copyIdButtonClick = async (page, name, id) => {
  const copyIdButton = await page.getByTestId(`copy-${name}-button`, true);
  await copyIdButton.click();
  const copiedText = await page.evaluate(() => navigator.clipboard.readText());

  expect(copiedText).toBe(id);
};

const infoIconButtonClick = async (page, name) => {
  const infoAccountIdButton = await page.getByTestId(`info-${name}-icon-button`, true);
  await infoAccountIdButton.click();
};

const learnMoreButtonClick = async (browser, page) => {
  const newPagePromise = new Promise((x) => browser.once('targetcreated', (target) => x(target.page())));
  const learnMoreButton = await page.getByTestId('learn-more-button', true);
  await learnMoreButton.click();
  await page.waitForTimeout(3000);

  const newPage = await newPagePromise;
  const url = await newPage.evaluate(() => document.location.href);
  expect(url).toBe('https://medium.com/plugwallet/internet-computer-ids-101-669b192a2ace');
};

const waitForWalletName = async (page) => {
  await page.waitForTimeout(500);
  await popupPageUtils.refreshWallet(page);

  const name = await getWalletName(page);
  const icnsName = 'bananas.icp';

  if (name !== icnsName) {
    return waitForWalletName(page);
  }

  return name;
};

// Utilities

describe('Account Details View', () => {
  let browser;
  let page;
  const principalId = 'principalId';
  const accountId = 'accountId';
  const icns = 'icns';

  const icnsName = 'bananas.icp';
  const AccountName = 'Account 122';

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
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('editing account name', async () => {
    await editAccountButtonClick(page, 'Account 1');
    await editAccountIconButtonClick(page);
    await fillNameInput(page, '22');
    await saveChangesIconButtonClick(page);
    await getWalletName(page, AccountName);
  });
  test('testing icns modal switch', async () => {
    await editAccountButtonClick(page, AccountName);
    await ICNSSwitchClick(page);
    await isICNSSelectorHidden(page);
  });
  test('testing icns modal info icon', async () => {
    await editAccountButtonClick(page, AccountName);
    await ICNSSwitchClick(page);
    await infoIconButtonClick(page, icns);
    await understandButtonClick(page, icns);
    await infoIconButtonClick(page, icns);
    await learnMoreButtonClick(browser, page);
  });

  test('selecting icns name', async () => {
    await editAccountButtonClick(page, AccountName);
    await openSelectionModalButtonClick(page);
    await selectICNSNameClick(page, icnsName);
    const name = await waitForWalletName(page);
    expect(name).toBe(icnsName);
  });

  test('disconnecting icns name', async () => {
    await editAccountButtonClick(page, AccountName);
    await ICNSSwitchClick(page);
    await isICNSSelectorHidden(page);
    await popupPageUtils.refreshWallet(page);
    await getWalletName(page, AccountName);
  });

  test('viewing additional wallet details Principal Id', async () => {
    await editAccountButtonClick(page, AccountName);
    await viewAdditionalInfoButtonClick(page);
    await copyIdButtonClick(page, principalId, secrets.mainPrincipalId);
    await infoIconButtonClick(page, principalId);
    await understandButtonClick(page, principalId);
    await infoIconButtonClick(page, principalId);
    await learnMoreButtonClick(browser, page);
  });

  test('viewing additional wallet details Account Id', async () => {
    await editAccountButtonClick(page, AccountName);
    await viewAdditionalInfoButtonClick(page);
    await copyIdButtonClick(page, accountId, secrets.mainAccountId);
    await infoIconButtonClick(page, accountId);
    await understandButtonClick(page, accountId);
    await infoIconButtonClick(page, accountId);
    await learnMoreButtonClick(browser, page);
  });
});
