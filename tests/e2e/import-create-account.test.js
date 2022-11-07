const { fillSeedPhraseInput } = require('../utils/seed');

const MINIMUM_PLUG_VERSION_ALLOWED = 60;

const getErrorMessage = async (page, error) => {
  const passwordErrorLabel = await page.getByTestId('password-error', true);
  const errorMessage = await page.evaluate((el) => el.textContent, passwordErrorLabel);
  expect(errorMessage).toBe(error);
};

describe('Import/Create', () => {
  let browser;
  let page;

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

  describe('Importing wallet', () => {
    beforeEach(async () => {
      const importButton = await page.getByTestId('import-wallet-button');
      await importButton.click();
    });

    test('failing on incorrect seedphrase', async () => {
      await fillSeedPhraseInput(page, badSeedphrase);
      const submitImportButton = await page.getByTestId('confirm-seedphrase-button');
      await submitImportButton.click();

      const updatedImportButton = await page.getByTestId('confirm-seedphrase-button');

      const importButtonClassName = await (await updatedImportButton.getProperty('className')).jsonValue();
      const importButtonClassNameArray = importButtonClassName.split(' ');

      expect(importButtonClassNameArray).toEqual(expect.arrayContaining(['Mui-disabled']));
    });

    test('failing on missmatched passwords', async () => {
      await fillSeedPhraseInput(page, secrets.seedphrase);

      const submitImportButton = await page.getByTestId('confirm-seedphrase-button');
      await submitImportButton.click();

      const newPasswordInput = await page.getByTestId('enter-password-input');
      const confirmPasswordInput = await page.getByTestId('confirm-password-input');

      await newPasswordInput.click();
      await newPasswordInput.type('TestPassword123');
      await confirmPasswordInput.click();
      await confirmPasswordInput.type('MissMatchedPassword');

      const submitPasswordButton = await page.getByTestId('confirm-seedphrase-button');
      await submitPasswordButton.click();

      await getErrorMessage(page, 'The passwords gotta match, smh!');
    });

    test('failing on password shorter than 12 characters', async () => {
      await fillSeedPhraseInput(page, secrets.seedphrase);

      const submitImportButton = await page.getByTestId('confirm-seedphrase-button');
      await submitImportButton.click();

      const newPasswordInput = await page.getByTestId('enter-password-input');
      const confirmPasswordInput = await page.getByTestId('confirm-password-input');

      await newPasswordInput.click();
      await newPasswordInput.type('123');
      await confirmPasswordInput.click();
      await confirmPasswordInput.type('123');

      const submitPasswordButton = await page.getByTestId('confirm-seedphrase-button');
      await submitPasswordButton.click();

      await getErrorMessage(page, 'The minimum is 8 characters, smh!');
    });

    test('importing wallet correctly', async () => {
      await fillSeedPhraseInput(page, secrets.seedphrase);

      const submitImportButton = await page.getByTestId('confirm-seedphrase-button');
      await submitImportButton.click();

      const newPasswordInput = await page.getByTestId('enter-password-input');
      const confirmPasswordInput = await page.getByTestId('confirm-password-input');

      await newPasswordInput.click();
      await newPasswordInput.type(secrets.password);
      await confirmPasswordInput.click();
      await confirmPasswordInput.type(secrets.password);

      const submitPasswordButton = await page.getByTestId('confirm-seedphrase-button');
      await submitPasswordButton.click();

      await page.goto(chromeData.popupUrl);

      const popupPasswordInput = await page.getByTestId('enter-password-input');
      await popupPasswordInput.type(secrets.password);

      const unlockPlugButton = await page.getByTestId('unlock-wallet-button');
      await unlockPlugButton.click();

      const plugBanner = await page.getByTestId('banner-text', true);

      const value = await page.evaluate((el) => el.textContent, plugBanner);
      const [, rawVersion] = value.split(' - ');
      const version = rawVersion.split('.').join('');

      expect(Number(version)).toBeGreaterThanOrEqual(MINIMUM_PLUG_VERSION_ALLOWED);
    });
  });

  describe('Creating wallet', () => {
    beforeEach(async () => {
      const createButton = await page.getByTestId('create-wallet-button');
      await createButton.click();
    });

    test('fails on missmatched passwords', async () => {
      const newPasswordInput = await page.getByTestId('enter-password-input');
      await newPasswordInput.click();
      await newPasswordInput.type('TestPassword123');

      const confirmPasswordInput = await page.getByTestId('confirm-password-input');
      await confirmPasswordInput.click();
      await confirmPasswordInput.type('MissMatchedPassword');

      const submitPasswordButton = await page.getByTestId('password-confirmation-button');
      await submitPasswordButton.click();

      await getErrorMessage(page, 'The passwords gotta match, smh!');
    });

    test('fails on password shorter than 12 characters', async () => {
      const newPasswordInput = await page.getByTestId('enter-password-input');
      await newPasswordInput.click();
      await newPasswordInput.type('123');

      const confirmPasswordInput = await page.getByTestId('confirm-password-input');
      await confirmPasswordInput.click();
      await confirmPasswordInput.type('123');

      const submitPasswordButton = await page.getByTestId('password-confirmation-button');
      await submitPasswordButton.click();

      await getErrorMessage(page, 'The minimum is 8 characters, smh!');
    });

    test('correctly creates', async () => {
      const newPasswordInput = await page.getByTestId('enter-password-input');
      await newPasswordInput.click();
      await newPasswordInput.type(secrets.password);

      const confirmPasswordInput = await page.getByTestId('confirm-password-input');
      await confirmPasswordInput.click();
      await confirmPasswordInput.type(secrets.password);

      const submitPasswordButton = await page.getByTestId('password-confirmation-button');
      await submitPasswordButton.click();

      const revealSeedphraseElement = await page.getByTestId('reveal-seedphrase-button', true);
      await revealSeedphraseElement.click();

      const seedphraseElement = await page.getByTestId('seedphrase-confirmation-checkbox');
      await seedphraseElement.click();

      const seedphraseContinueButton = await page.getByTestId('reveal-seedphrase-continue-button');
      await seedphraseContinueButton.click();

      await page.goto(chromeData.popupUrl);

      await popupPageUtils.profileButtonClick(page);

      const lockWalletButton = await page.getByTestId('lock-button');
      await lockWalletButton.click();

      await optionsPageUtils.unlock(page, secrets.password);
    });
  });
});
