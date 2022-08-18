describe('Create subaccount', () => {
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

  test('canceling creating subaccount', async () => {
    await popupPageUtils.createAccountButtonClick(page);

    await popupPageUtils.fillNameInput(page, 'Test');

    const cancelButton = await page.getByTestId('create-account-cancel-button', true);
    await cancelButton.click();
  });

  test('creating subaccount', async () => {
    await popupPageUtils.createSubAccount(page, 'Test');
  });
});
