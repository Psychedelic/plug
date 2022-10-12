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
  const saveContactButton = await page.waitForSelector('[data-testid="add-button"]:not([disabled])');
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

const copyContactsAddress = async (page, { handle, name }) => {
  const copyButton = await page.getByTestId(`copy-contact-button-${name}`, true);
  await copyButton.click();

  const copiedText = await page.evaluate(() => navigator.clipboard.readText());

  expect(copiedText).toBe(handle);
};

const deleteContact = async (page, { name }) => {
  const deleteButton = await page.getByTestId(`delete-contact-button-${name}`, true);
  await deleteButton.click();

  const confirmDeletingButton = await page.getByTestId('confirm-deleting-button', true);
  await confirmDeletingButton.click();

  await page.waitForTestIdSelector(`delete-contact-button-${name}`, { hidden: true });
};

describe('Contacts', () => {
  let browser;
  let page;
  const errorText = 'Incorrect ID format.';

  const correctData = [
    { handle: secrets.sub4PrincipalId, name: 'Subaccount PrincipalID' },
    { handle: secrets.subAccountId, name: 'Subaccount AccountID' },
    { handle: secrets.icnsName, name: 'Subaccount ICNS' },
  ];

  const wrongData = [
    { handle: secrets.sub4PrincipalId, errorMessage: 'This contact already exists under "Subaccount PrincipalID".' },
    { handle: secrets.wrongId, errorMessage: errorText },
    { handle: secrets.wrongAccountId, errorMessage: errorText },
    { handle: secrets.wrongICNSName, errorMessage: errorText },
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
    for (const data of correctData) {
      await addCorrectContact(page, data);
    }
  });

  test('adding contact: which already exist, have nonexistent principal id, account id and ICNS name', async () => {
    for (const data of wrongData) {
      await addWrongContact(page, data);
    }
  });

  test("copying contact's address", async () => {
    for (const data of correctData) {
      await copyContactsAddress(page, data);
    }
  });

  test('deleting contact', async () => {
    for (const data of correctData) {
      await deleteContact(page, data);
    }
  });
});
