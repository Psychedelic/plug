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

// Utilities

describe('Send View', () => {
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
  });
});
