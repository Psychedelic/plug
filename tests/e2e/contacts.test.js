/* eslint-disable no-await-in-loop */
const settingsButtonClick = async (page) => {
  const settingsButton = await page.getByTestId('settings-button', true);
  await settingsButton.click();
};

const contactBookMenuButtonClick = async (page) => {
  const contactBookMenuButton = await page.getByTestId('contact-book', true);
  await contactBookMenuButton.click();
};

const addContactButtonClick = async (page) => {
  const addContactButton = await page.getByTestId('add-contact-button', true);
  await addContactButton.click();
};

const nameInputFill = async (page, name) => {
  const nameInput = await page.getByTestId('name-input', true);
  await nameInput.click();
  await nameInput.type(name);
};

const principalIdInputFill = async (page, id) => {
  const principalIdInput = await page.getByTestId('principalid-input', true);
  await principalIdInput.click();
  await principalIdInput.type(id);
};

const saveContactButtonClick = async (page) => {
  const saveContactButton = await page.getByTestId('add-button', true);
  await saveContactButton.click();
};

const isErrorMessageShown = async (page, errorMessage) => {
  const error = await page.getByTestId('error', true);
  const errorText = await page.evaluate((el) => el.textContent, error);
  expect(errorText).toBe(errorMessage);
};

const isContinueButtonDisabled = async (page) => {
  const disabledContinueButton = await page.$('[data-testid="add-button"][disabled]') !== null;
  expect(disabledContinueButton).toBe(true);
};

const backButtonClick = async (page) => {
  const backButton = await page.getByTestId('back-button', true);
  await backButton.click();
};

const addWrongContact = async (page, { handle, errorMessage }) => {
  await addContactButtonClick(page);
  await principalIdInputFill(page, handle);
  await isErrorMessageShown(page, errorMessage);
  await isContinueButtonDisabled(page);
  await backButtonClick(page);
};

const addCorrectContact = async (page, { handle, name }) => {
  await addContactButtonClick(page);
  await nameInputFill(page, name);
  await principalIdInputFill(page, handle);
  await saveContactButtonClick(page);
  await page.getByTestId(`contact-name-${name}`, true);
};
// Utilities

describe('Contacts', () => {
  let browser;
  let page;
  const errorText = 'Incorrect ID format.';

  const correctData = [
    { handle: secrets.subPrincipalId, name: 'Subaccount PrincipalID' },
    { handle: secrets.subAccountId, name: 'Subaccount AccountID' },
    { handle: secrets.icnsName, name: 'Subaccount ICNS' },
  ];

  const wrongData = [
    { handle: secrets.subPrincipalId, errorMessage: 'This contact already exists under "Subaccount PrincipalID".' },
    { handle: secrets.wrongId, errorMessage: errorText },
    { handle: secrets.wrongAccountId, errorMessage: errorText },
    { handle: secrets.wrongICNSname, errorMessage: errorText },
  ];

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
    await popupPageUtils.profileButtonClick(page);
    await settingsButtonClick(page);
    await contactBookMenuButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('back to settings', async () => {
    await backButtonClick(page);
    await contactBookMenuButtonClick(page);
  });

  test('adding contact', async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const data of correctData) {
      // eslint-disable-next-line indent
            await addCorrectContact(page, data);
    }
  });

  test('adding contact: which already exist, have nonexistent principal id, account id and ICNS name', async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const data of wrongData) {
    // eslint-disable-next-line indent
        await addWrongContact(page, data);
    }
  });
});
