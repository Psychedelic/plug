describe('Send View', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing and unlocking the account
    page = await utils.createNewPage(browser);

    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);

    await page.close();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.popupUrl);
    await popupPageUtils.waitForProfileButton(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('adding custom token', async () => {
    const addCustomTokenButton = await page.getByTestId('add-custom-token-button', true);
    await addCustomTokenButton.click();

    const customTokenTab = await page.getByTestId('tab-item-Custom', true);
    await customTokenTab.click();

    const canisterIdInput = await page.getByTestId('token-canister-id-input', true);
    await canisterIdInput.click();
    await canisterIdInput.type(secrets.dustCanisterId);

    const tokenStandardSelect = await page.getByTestId('token-standard-select', true);
    await tokenStandardSelect.click();

    const dip20StandardItem = await page.getByTestId('standard-item-DIP20', true);
    await dip20StandardItem.click();

    const continueButton = await page.getByTestId('continue-button', true);
    await continueButton.click();

    const addButton = await page.getByTestId('add-button', true);
    await addButton.click();

    const assetTitle = await page.getByTestId('asset-name-Dust', true);
    const content = await page.evaluate((el) => el.textContent, assetTitle);

    expect(content).toBe('Dust');
  });
});
