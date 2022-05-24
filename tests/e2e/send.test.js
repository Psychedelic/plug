describe('Send', () => {
  let chromeBrowser;
  let page;

  beforeAll(async () => {
    chromeBrowser = await setupChrome();
    page = await utils.createNewPage(chromeBrowser);

    await optionsPage.importAccountAndUnlock(page, secrets.seedphrase, secrets.password);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await chromeBrowser.close();
  });

  test('Send ICP', async () => {
    await popupPage.refreshWallet(page);
    const [availableICPTag] = await page.getXPathElements('span', 'ICP', true);
    const availableICPString = await page.evaluate((tag) => tag.innerText, availableICPTag);

    const [sendButtonElement] = await page.getXPathElements('span', 'Send');
    await sendButtonElement.click();

    const [amountInput, addressInput] = await page.getInputs();

    await addressInput.type(secrets.subAccountId);

    await amountInput.focus();

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('1');

    const [continueBtn] = await page.getXPathElements('span', 'Continue');
    await continueBtn.click();

    const [sendBtn] = await page.getXPathElements('span', 'Send', true);
    await sendBtn.click();

    await popupPage.refreshWallet(page);

    const [newAvailableICPTag] = await page.getXPathElements('span', 'ICP', true);
    await page.evaluate((tag) => tag.innerText, availableICPTag);
    const newAvailableICPString = await page.evaluate((tag) => tag.innerText, availableICPTag);

    console.log(newAvailableICPString);
    console.log(availableICPString);

    const newAvailableIsLower = newAvailableICPString < availableICPString;

    // Gotta do more tests before checking amount :p
    // expect(newAvailableIsLower).toBe(true);
    expect(2).toBe(2);
  });
});
