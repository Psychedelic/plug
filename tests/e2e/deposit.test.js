const depositViewButtonClick = async (page) => {
  const depositViewButton = await page.getByTestId('open-deposit-view-button', true);
  await depositViewButton.click();
};

const checkIsCopyButtonTextMatch = async (page, name, id) => {
  const copyButton = await page.getByTestId(`copy-${name}-button`, true);
  await copyButton.click();
  const copiedText = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedText).toBe(id);
};

const qrCodeIconButtonClick = async (page) => {
  const qrCodeIconButton = await page.getByTestId('qr-code-icon-button', true);
  await qrCodeIconButton.click();
};

const closeQrCodeModalButtonClick = async (page) => {
  const qrCodeIconButton = await page.getByTestId('close-qr-code-modal-button', true);
  await qrCodeIconButton.click();
};

const checkIsSubtitleTextMatch = async (page, name, text) => {
  const subtitle = await page.getByTestId(`deposit-${name}-subtitle`, true);
  const subtitleText = await page.evaluate((el) => el.textContent, subtitle);
  expect(subtitleText).toBe(text);
};

describe('Deposit View', () => {
  let browser;
  let page;

  const principalId = 'principalId';
  const accountId = 'accountId';

  const principalIdSubtitle = "Use when receiving from Plug accounts or other apps that support sending directly to Principal ID's.";
  const accountIdSubtitle = "Use when receiving from exchanges or other apps that only support sending to Account ID's.";

  beforeAll(async () => {
    browser = await setupChrome();

    // Importing and unlocking the accoun
    page = await utils.createNewPage(browser);

    await optionsPageUtils.importAccount(page, secrets.seedphrase, secrets.password);
    await optionsPageUtils.unlock(page, secrets.password);
    await depositViewButtonClick(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('deposit view content is rendered correctly', async () => {
    await checkIsSubtitleTextMatch(page, principalId, principalIdSubtitle);
    await checkIsSubtitleTextMatch(page, accountId, accountIdSubtitle);

    await checkIsCopyButtonTextMatch(page, principalId, secrets.mainPrincipalId);
    await checkIsCopyButtonTextMatch(page, accountId, secrets.mainAccountId);

    await qrCodeIconButtonClick(page);
    await closeQrCodeModalButtonClick(page);
  });
});
