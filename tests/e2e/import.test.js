describe('Import/Create', () => {
  let browser;
  let page;

  const passwordErrorLabel = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div.MuiGrid-root.makeStyles-passwordError-4.MuiGrid-item.MuiGrid-grid-xs-12 > p';

  const badSeedphrase = 'sadf adsf adfdfasd adfad adfafd sdfsd sdfsdf sdfds sdfd sdf sfsfs sdfadsf';

  beforeAll(async () => {
    browser = await setupChrome();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.optionsUrl);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Import', () => {
    beforeEach(async () => {
      const importButton = await page.getTestIdElement('import-wallet-button');
      await importButton.click();
    });

    test('Fails on incorrect seedphrase', async () => {
      const importInputElement = await page.getTestIdElement('seedphrase-input');
      await importInputElement.type(badSeedphrase);

      const submitImport = await page.getTestIdElement('confirm-seedphrase-button');
      await submitImport.click();

      const updatedImportBtn = await page.getButtonWithIndex(0);
      const importButtonClassName = await (await updatedImportBtn.getProperty('className')).jsonValue();
      const importButtonClassNameArray = importButtonClassName.split(' ');

      expect(importButtonClassNameArray).toEqual(expect.arrayContaining(['Mui-disabled']));
    });

    test('Fails on missmatched passwords', async () => {
      const importInputElement = await page.getTestIdElement('seedphrase-input');
      await importInputElement.type(secrets.seedphrase);

      const submitImport = await page.getTestIdElement('confirm-seedphrase-button');
      await submitImport.click();

      const [passwordInput, confirmPasswordInput] = await page.getInputs();
      await passwordInput.type('TestPassword123');
      await confirmPasswordInput.type('MissMatchedPassword');

      // const submitPassword = await page.getButtonWithIndex(0);
      await submitPassword.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel);
      const value = await page.evaluate((el) => el.textContent, labelErrorElement);

      expect(value).toBe('The passwords gotta match, smh!');
    });

    test('Fails on password shorter than 12 characters', async () => {
      // const importInputElement = await page.getElement('textarea');
      await importInputElement.type(secrets.seedphrase);

      // const submitImport = await page.getButtonWithIndex(0);
      await submitImport.click();

      // const [passwordInput, confirmPasswordInput] = await page.getInputs();
      await passwordInput.type('123');
      await confirmPasswordInput.type('123');

      // const submitPassword = await page.getButtonWithIndex(0);
      await submitPassword.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel);
      const value = await page.evaluate((el) => el.textContent, labelErrorElement);

      expect(value).toBe('The minimum is 12 characters, smh!');
    });

    test('Correctly imports', async () => {
      // const importInputElement = await page.getElement('textarea');
      await importInputElement.type(secrets.seedphrase);

      // const submitImport = await page.getButtonWithIndex(0);
      await submitImport.click();

      // const [passwordInput, confirmPasswordInput] = await page.getInputs(true);
      await passwordInput.type(secrets.password);
      await confirmPasswordInput.type(secrets.password);

      // const submitPassword = await page.getButtonWithIndex(0);
      await submitPassword.click();

      await page.goto(chromeData.popupUrl);

      // const popupPasswordInput = await page.getInputWithIndex(0, true);
      await popupPasswordInput.type(secrets.password);

      // const unlockPlugButton = await page.getButtonWithIndex(0);
      await unlockPlugButton.click();

      // const [plugBanner] = await page.getXPathElements('span', 'Alpha Release', true);
      const value = await page.evaluate((el) => el.textContent, plugBanner);

      expect(value).toMatch(/Plug/i);
    });
  });

  describe('Create', () => {
    beforeEach(async () => {
      // const createButton = await page.getButtonWithIndex(1);
      await createButton.click();
    });

    test('Fails on missmatched passwords', async () => {
      // const [passwordInput, confirmPasswordInput] = await page.getInputs();
      await passwordInput.type('TestPassword123');
      await confirmPasswordInput.type('MissMatchedPassword');

      // const submitPasswordButton = await page.getButtonWithIndex(0);
      await submitPasswordButton.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel);
      const value = await page.evaluate((el) => el.textContent, labelErrorElement);

      expect(value).toBe('The passwords gotta match, smh!');
    });

    test('Fails on password shorter than 12 characters', async () => {
      // const [passwordInput, confirmPasswordInput] = await page.getInputs();
      await passwordInput.type('123');
      await confirmPasswordInput.type('123');

      // const submitPasswordButton = await page.getButtonWithIndex(0);
      await submitPasswordButton.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel);
      const value = await page.evaluate((el) => el.textContent, labelErrorElement);

      expect(value).toBe('The minimum is 12 characters, smh!');
    });

    test('Correctly creates', async () => {
      // const [passwordInput, confirmPasswordInput] = await page.getInputs();
      await passwordInput.type(secrets.password);
      await confirmPasswordInput.type(secrets.password);

      // const submitPasswordButton = await page.getButtonWithIndex(0);
      await submitPasswordButton.click();

      // const [revealSeedphraseElement] = await page.getXPathElements('span', 'Reveal Secret Recovery Phrase', true);
      await revealSeedphraseElement.click();

      // const confirmSeedphraseElement = await page.getInputWithIndex(0);
      await confirmSeedphraseElement.click();

      // const continueBtn = await page.getButtonWithIndex(0);
      await continueBtn.click();

      await page.goto(chromeData.popupUrl);

      // const popupPasswordInput = await page.getInputWithIndex(0, true);
      await popupPasswordInput.type(secrets.password);

      // const unlockPlugButton = await page.getButtonWithIndex(0);
      await unlockPlugButton.click();

      // const [plugBanner] = await page.getXPathElements('span', 'Alpha Release', true);
      const value = await page.evaluate((el) => el.textContent, plugBanner);

      expect(value).toMatch(/Plug/i);
    });
  });
});
