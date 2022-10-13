describe('delete-pem-account', () => {
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
    const importAccountButton = await page.getByTestId('import-account-button', true);
    await importAccountButton.click();
  });

  test.only('import wallet using string', async () => {
    const importPemFile = await page.getByTestId('input-pem-file');
    await importPemFile.uploadFile('tests/pemFolder/a1.pem');
    const submitPemButton = await page.getByTestId('submit-pem-file', true);
    await submitPemButton.click();
    await page.waitForTestIdSelector('input-pem-acc-name');
    const inputAccName = await page.getByTestId('input-pem-acc-name');
    await inputAccName.click();
    await inputAccName.type('pem-account');
    const submitPemFile = await page.getByTestId('submit-pem-account');
    await submitPemFile.click();
  });
});
