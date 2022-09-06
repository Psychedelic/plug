const settingsButtonClick = async (page) => {
  const settingsButton = await page.getByTestId('settings-button', true);
  await settingsButton.click();
};

const networkButtonClick = async (page) => {
  const seedPhraseButton = await page.getByTestId('network', true);
  await seedPhraseButton.click();
};

const backButtonClick = async (page) => {
  const closeButton = await page.getByTestId('back-button', true);
  await closeButton.click();
};

const networkCardClick = async (page, name) => {
  const closeButton = await page.getByTestId(`network-card-${name}`, true);
  await closeButton.click();
};

const deleteNetworkButtonClick = async (page, name) => {
  const closeButton = await page.getByTestId(`delete-network-button-${name}`, true);
  await closeButton.click();
};

const isCurrentNetworkMatch = async (page, network) => {
  const inputErrorLabel = await page.getByTestId('current-network-name', true);
  const currentNetworkName = await page.evaluate((el) => el.textContent, inputErrorLabel);
  expect(currentNetworkName).toBe(network);
};

describe('Settings: Help', () => {
  let browser;
  let page;

  const sonic = 'Sonic';
  const mainnet = 'Mainnet';

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing the account
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
    await networkButtonClick(page);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking that the Back button sends a user to the Settings', async () => {
    await backButtonClick(page);
    await page.waitForSelector('[data-testid="network"]');
  });

  test('adding the new network and checking that network change is correct after clicking on network card', async () => {
    await popupPageUtils.addSonicNetwork(page);
    await popupPageUtils.profileButtonClick(page);
    await settingsButtonClick(page);
    await networkButtonClick(page);
    await networkCardClick(page, sonic);
    await isCurrentNetworkMatch(page, sonic);
    await networkCardClick(page, mainnet);
    await isCurrentNetworkMatch(page, mainnet);
  });

  test('deleting the newly added network/checking that deleted network was deleted, and the current network changed on mainnet ', async () => {
    await popupPageUtils.profileButtonClick(page);
    await settingsButtonClick(page);
    await networkButtonClick(page);
    await deleteNetworkButtonClick(page, sonic);
    await page.waitForTestIdSelector('delete-network-button-Sonic', { hidden: false });
    await isCurrentNetworkMatch(page, mainnet);
  });
});
