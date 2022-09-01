const openSelectNetworkModalButtonClick = async (page, boolean) => {
  const openSelectNetworkModalButton = await page.getByTestId('network-selector', true);
  await openSelectNetworkModalButton.click();
  await page.waitForTestIdSelector('network-selection-modal', { hidden: boolean });
};

const selectNetworkCardClick = async (page, name) => {
  const selectNetworkButton = await page.getByTestId(`network-card-${name}`, true);
  await selectNetworkButton.click();
};

describe('Network', () => {
  let browser;
  let page;

  const networkName = 'Sonic';
  const hostURL = 'https://testnet.sonic.ooo:8420/';
  const ledgerCanisterID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

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
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('checking that clicking on Network Select button opens and close the network modal', async () => {
    await openSelectNetworkModalButtonClick(page, false);
    await openSelectNetworkModalButtonClick(page, true);
  });
});
