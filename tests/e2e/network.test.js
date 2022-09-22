const openSelectNetworkModalButtonClick = async (page, boolean) => {
  const openSelectNetworkModalButton = await page.getByTestId('network-selector', true);
  await openSelectNetworkModalButton.click();
  await page.waitForTestIdSelector('network-selection-modal', { hidden: boolean });
};

const selectNetworkCardClick = async (page, name) => {
  const selectNetworkButton = await page.getByTestId(`network-card-${name}`, true);
  await selectNetworkButton.click();
};

const exitButtonClick = async (page, button) => {
  const addNetworkButton = await page.getByTestId(button, true);
  await addNetworkButton.click();
};

const isErrorMatch = async (page, testId, error) => {
  const inputErrorLabel = await page.getByTestId(testId, true);
  const errorMessage = await page.evaluate((el) => el.textContent, inputErrorLabel);
  expect(errorMessage).toBe(error);
};

const isCurrentNetworkMatch = async (page, network) => {
  const inputErrorLabel = await page.getByTestId('current-network-name', true);
  const currentNetworkName = await page.evaluate((el) => el.textContent, inputErrorLabel);
  expect(currentNetworkName).toBe(network);
};

const isTabDisabled = async (page, tab) => {
  await page.waitForSelector(`[data-testid="tab-item-${tab}"][disabled]`);
};

describe('Network', () => {
  let browser;
  let page;

  const networkName = 'Sonic';

  const exitButtonData = ['back-button', 'close-button'];

  const networkInputNameTestID = 'network-input-name';
  const networkInputHostTestID = 'network-input-host';
  const networkInputCanisterIDTestID = 'network-input-ledgerCanisterId';

  const networkInputNameErrorTestID = 'network-error-name';
  const networkInputHostErrorTestID = 'network-error-host';
  const networkInputCanisterIDErrorTestID = 'network-error-ledgerCanisterId';

  const wrongNetworkData = [
    { testId: networkInputHostTestID, value: secrets.wrongHostName },
    { testId: networkInputCanisterIDTestID, value: secrets.wrongCanisterId },
  ];

  const correctNetworkData = [
    { testId: networkInputNameTestID, value: secrets.networkName },
    { testId: networkInputHostTestID, value: secrets.hostName },
    { testId: networkInputCanisterIDTestID, value: secrets.canisterID },
  ];

  const inputsErrorsData = [
    { testId: networkInputNameErrorTestID, errorMessage: 'Required' },
    { testId: networkInputHostErrorTestID, errorMessage: 'Invalid URL' },
    { testId: networkInputCanisterIDErrorTestID, errorMessage: 'Invalid canister ID' },
  ];

  const inputsErrorsData2 = [
    { testId: networkInputNameErrorTestID, errorMessage: 'There is already a network with that name' },
    { testId: networkInputHostErrorTestID, errorMessage: 'There is already a network with that host' },
  ];

  const tabs = ['NFTs', 'Activity', 'Apps'];

  beforeAll(async () => {
    browser = await setupChrome();

    page = await utils.createNewPage(browser);

    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);

    await page.close();
  });

  beforeEach(async () => {
    page = await utils.createNewPage(browser);
    await page.goto(chromeData.popupUrl);
    await openSelectNetworkModalButtonClick(page, false);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking that clicking on Network Select button opens and close the network modal', async () => {
    await openSelectNetworkModalButtonClick(page, true);
  });

  test('checking that the Back and Close button sends a user from the Add Network flow to the Main flow', async () => {
    for (const data of exitButtonData) {
      await popupPageUtils.addNetworkButtonClick(page);
      await exitButtonClick(page, data);
      await page.waitForTestIdSelector('open-deposit-view-button', { hidden: false });
      await openSelectNetworkModalButtonClick(page, false);
    }
  });

  test('checking inputs validation on Add Network flow', async () => {
    await popupPageUtils.addNetworkButtonClick(page);
    for (const data of wrongNetworkData) {
      await popupPageUtils.inputFill(page, data.testId, data.value);
    }
    await popupPageUtils.addNetworkButtonClick(page);
    for (const data of inputsErrorsData) {
      await isErrorMatch(page, data.testId, data.errorMessage);
    }
  });

  test('adding a new network and switching on it/checking that the extension does not allow to add an existing network', async () => {
    await popupPageUtils.addNetworkButtonClick(page);
    for (const data of correctNetworkData) {
      await popupPageUtils.inputFill(page, data.testId, data.value);
    }
    await popupPageUtils.addNetworkButtonClick(page);
    await openSelectNetworkModalButtonClick(page, false);
    await selectNetworkCardClick(page, networkName);
    await page.waitForTestIdSelector('network-selection-modal', { hidden: true });
    await page.waitForSelector('[data-testid="tab-item-NFTs"][disabled]');
    await isCurrentNetworkMatch(page, networkName);
    await page.waitForTestIdSelector('asset-name-XTC', { hidden: true });
  });

  test('checking that the extension does not allow to add an existing network', async () => {
    await popupPageUtils.addSonicNetwork(page);
    for (const data of inputsErrorsData2) {
      await isErrorMatch(page, data.testId, data.errorMessage);
    }
  });

  test('checking that all tabs except the tokens tab are blocked ', async () => {
    for (const data of tabs) {
      await isTabDisabled(page, data);
    }
  });
});
