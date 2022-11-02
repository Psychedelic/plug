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

const clickAccountNameInput = async (page) => {
  const nameInput = await page.getByTestId('account-name-input', true);
  await nameInput.click();
  return nameInput;
};

const fillNameInput = async (page, symbols) => {
  const nameInput = await clickAccountNameInput(page);
  await nameInput.type(symbols);
};

const deleteSymbolsFromInput = async (page) => {
  await clickAccountNameInput(page);
  await page.keyboard.press('Backspace');
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
  await page.waitForTimeout(3000);
  const openSelectionModalButton = await page.getByTestId('open-selection-modal-button', true);
  await openSelectionModalButton.click();
};

const selectICNSNameClick = async (page, icnsName) => {
  const selectICNSName = await page.getByTestId(`icns-name-${icnsName}`, true);
  await selectICNSName.click();
  await page.waitForTimeout(3000);
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
  expect(url).toContain('https://medium.com/plugwallet/internet-computer-ids-101-669b192a2ace');
};

const waitForWalletName = async (page, walletName, timeout = 1000) => {
  await page.waitForTimeout(timeout);
  await popupPageUtils.refreshWallet(page);

  const currentWalletName = await getWalletName(page);

  if (currentWalletName !== walletName) {
    return waitForWalletName(page, walletName, timeout);
  }
  return currentWalletName;
};

// Utilities

describe('Account Details View', () => {
  let browser;
  let page;
  const principalId = 'principalId';
  const accountId = 'accountId';
  const icns = 'icns';

  const accountName = 'Account 1';
  const icnsName1 = 'bananas.icp';
  const icnsName2 = 'plugtest.icp';

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
    await editAccountButtonClick(page, accountName);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('editing account name', async () => {
    await editAccountIconButtonClick(page);
    await fillNameInput(page, '2');
    await saveChangesIconButtonClick(page);
    const changedName = await waitForWalletName(page, 'Account 12');
    expect(changedName).toBe('Account 12');

    await editAccountIconButtonClick(page);
    await deleteSymbolsFromInput(page);
    await saveChangesIconButtonClick(page);
    const standardName = await waitForWalletName(page, accountName);
    expect(standardName).toBe(accountName);
  });
  test('testing the existence or visibility of the icns modal switch', async () => {
    await ICNSSwitchClick(page);
    await isICNSSelectorHidden(page);
  });
  test('testing icns modal info icon', async () => {
    await ICNSSwitchClick(page);
    await infoIconButtonClick(page, icns);
    await understandButtonClick(page, icns);
    await infoIconButtonClick(page, icns);
    await learnMoreButtonClick(browser, page);
  });

  test('selecting icns name', async () => {
    await openSelectionModalButtonClick(page);
    await selectICNSNameClick(page, icnsName1);
    const name1 = await waitForWalletName(page, icnsName1);
    expect(name1).toBe(icnsName1);

    await popupPageUtils.profileButtonClick(page);
    await editAccountButtonClick(page, accountName);

    await openSelectionModalButtonClick(page);
    await selectICNSNameClick(page, icnsName2);
    const name2 = await waitForWalletName(page, icnsName2);
    expect(name2).toBe(icnsName2);
  });

  test('disconnecting icns name', async () => {
    await ICNSSwitchClick(page);
    await isICNSSelectorHidden(page);
    await popupPageUtils.refreshWallet(page);
    const name = await waitForWalletName(page, accountName);
    expect(name).toBe(accountName);
  });

  test('viewing additional wallet details Principal Id', async () => {
    await viewAdditionalInfoButtonClick(page);
    await copyIdButtonClick(page, principalId, secrets.mainPrincipalId);
    await infoIconButtonClick(page, principalId);
    await understandButtonClick(page, principalId);
    await infoIconButtonClick(page, principalId);
    await learnMoreButtonClick(browser, page);
  });

  test('viewing additional wallet details Account Id', async () => {
    await viewAdditionalInfoButtonClick(page);
    await copyIdButtonClick(page, accountId, secrets.mainAccountId);
    await infoIconButtonClick(page, accountId);
    await understandButtonClick(page, accountId);
    await infoIconButtonClick(page, accountId);
    await learnMoreButtonClick(browser, page);
  });
});
