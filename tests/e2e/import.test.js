describe('Import/Create', () => {
  let chromeBrowser;
  let page;

  const passwordErrorLabel = '#options-root > div > div.MuiContainer-root.MuiContainer-maxWidthSm > div > div.MuiGrid-root.makeStyles-passwordError-4.MuiGrid-item.MuiGrid-grid-xs-12 > p';

  const badSeedphrase = 'sadf adsf adfdfasd adfad adfafd sdfsd sdfsdf sdfds sdfd sdf sfsfs sdfadsf';

  const getButtonCollection = async (page) => {
    return await page.$$('button');
  }

  const getImportButton = async (page) => {
    const buttonCollection = await getButtonCollection(page);
    return buttonCollection[0];
  };

  const getCreateButton = async (page) => {
    const buttonCollection = await getButtonCollection(page);
    return buttonCollection[1];
  };

  beforeAll(async () => {
    chromeBrowser = await setupChrome();
  });
  
  beforeEach(async () => {
    page = await chromeBrowser.newPage();
    await page.goto(chromeData.optionsUrl);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await chromeBrowser.close();
  });

  describe('Import', () => {
    beforeEach(async () => {
      const importButton = await utils.getButtonWithIndex(page, 0);
      await importButton.click();
    });

    test('Fails on incorrect seedphrase', async () => {
      const importInputElement = await utils.getElement(page, 'textarea');
      await importInputElement.type(badSeedphrase);

      const submitImport = await utils.getButtonWithIndex(page, 0);
      await submitImport.click();

      const updatedImportBtn = await utils.getButtonWithIndex(page, 0);
      const importButtonClassName = await (await updatedImportBtn.getProperty('className')).jsonValue();
      const importButtonClassNameArray = importButtonClassName.split(' ');

      expect(importButtonClassNameArray).toEqual(expect.arrayContaining(['Mui-disabled']));
    });

    test('Fails on missmatched passwords', async () => {
      const importInputElement = await utils.getElement(page, 'textarea');
      await importInputElement.type(secrets.seedphrase);

      const submitImport = await utils.getButtonWithIndex(page, 0);
      await submitImport.click();

      await utils.waitForRender(500);
      const [passwordInput, confirmPasswordInput] = await utils.getInputs(page);
      await passwordInput.type('TestPassword123');
      await confirmPasswordInput.type('MissMatchedPassword');

      const submitPassword = await utils.getButtonWithIndex(page, 0);
      await submitPassword.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel)
      const value = await page.evaluate(el => el.textContent, labelErrorElement);

      expect(value).toBe('The passwords gotta match, smh!');
    });

    test('Fails on password shorter than 12 characters', async () => {
      const importInputElement = await utils.getElement(page, 'textarea');
      await importInputElement.type(secrets.seedphrase);

      const submitImport = await utils.getButtonWithIndex(page, 0);
      await submitImport.click();

      const [passwordInput, confirmPasswordInput] = await utils.getInputs(page);
      await passwordInput.type('123');
      await confirmPasswordInput.type('123');

      const submitPassword = await utils.getButtonWithIndex(page, 0);
      await submitPassword.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel)
      const value = await page.evaluate(el => el.textContent, labelErrorElement);

      expect(value).toBe('The minimum is 12 characters, smh!');
    });

    test('Correctly imports', async () => {
      const importInputElement = await utils.getElement(page, 'textarea');
      await importInputElement.type(secrets.seedphrase);

      const submitImport = await utils.getButtonWithIndex(page, 0);
      await submitImport.click();

      const [passwordInput, confirmPasswordInput] = await utils.getInputs(page, true);
      await passwordInput.type(secrets.password);
      await confirmPasswordInput.type(secrets.password);

      const submitPassword = await utils.getButtonWithIndex(page, 0);
      await submitPassword.click();

      await page.goto(chromeData.popupUrl);

      const popupPasswordInput = await utils.getInputWithIndex(page, 0, true);
      await popupPasswordInput.type(secrets.password);

      const unlockPlugButton = await utils.getButtonWithIndex(page, 0);
      await unlockPlugButton.click();

      const [plugBanner] = await utils.getXPathElements(page, 'span', 'Alpha Release', true);
      const value = await page.evaluate(el => el.textContent, plugBanner);

      expect(value).toMatch(/Plug/i);
    });
  });

  describe('Create', () => {
    beforeEach(async () => {
      const createButton = await utils.getButtonWithIndex(page, 1);
      await createButton.click();
    });

    test('Fails on missmatched passwords', async () => {
      const [passwordInput, confirmPasswordInput] = await utils.getInputs(page);
      await passwordInput.type('TestPassword123');
      await confirmPasswordInput.type('MissMatchedPassword');

      const submitPasswordButton = await utils.getButtonWithIndex(page, 0);
      await submitPasswordButton.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel)
      const value = await page.evaluate(el => el.textContent, labelErrorElement);

      expect(value).toBe('The passwords gotta match, smh!');
    });

    test('Fails on password shorter than 12 characters', async () => {
      const [passwordInput, confirmPasswordInput] = await utils.getInputs(page);
      await passwordInput.type('123');
      await confirmPasswordInput.type('123');

      const submitPasswordButton = await utils.getButtonWithIndex(page, 0);
      await submitPasswordButton.click();

      await page.waitForSelector(passwordErrorLabel);
      const labelErrorElement = await page.$(passwordErrorLabel)
      const value = await page.evaluate(el => el.textContent, labelErrorElement);

      expect(value).toBe('The minimum is 12 characters, smh!');
    });

    test('Correctly creates', async () => {
      const [passwordInput, confirmPasswordInput] = await utils.getInputs(page);
      await passwordInput.type(secrets.password);
      await confirmPasswordInput.type(secrets.password);

      const submitPasswordButton = await utils.getButtonWithIndex(page, 0);
      await submitPasswordButton.click();

      const [revealSeedphraseElement] = await utils.getXPathElements(page, 'span', 'Reveal Secret Recovery Phrase', true);
      await revealSeedphraseElement.click();

      const confirmSeedphraseElement = await utils.getInputWithIndex(page, 0);
      await confirmSeedphraseElement.click();

      const continueBtn = await utils.getButtonWithIndex(page, 0);
      await continueBtn.click();

      await page.goto(chromeData.popupUrl);

      const popupPasswordInput = await utils.getInputWithIndex(page, 0, true);
      await popupPasswordInput.type(secrets.password);

      const unlockPlugButton = await utils.getButtonWithIndex(page, 0);
      await unlockPlugButton.click();

      const [plugBanner] = await utils.getXPathElements(page, 'span', 'Alpha Release', true);
      const value = await page.evaluate(el => el.textContent, plugBanner);

      expect(value).toMatch(/Plug/i);
    });
  });
});
