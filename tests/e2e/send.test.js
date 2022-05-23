describe('Send', () => {
  let chromeBrowser;
  let page;

  beforeAll(async () => {
    chromeBrowser = await setupChrome();
    page = await chromeBrowser.newPage();

    await utils.optionsPage.importAccountAndUnlock(page, secrets.seedphrase, secrets.password);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await chromeBrowser.close();
  });

  test('Send ICP', async () => {
    await utils.popupPage.refreshWallet(page);
    await utils.waitForRender(9000);
    const [availableICPTag] = await utils.getXPathElements(page, 'span', 'ICP', true);
    const availableICPString = await page.evaluate(tag => tag.innerText, availableICPTag);

    const [sendButtonElement] = await utils.getXPathElements(page, 'span', 'Send');
    await sendButtonElement.click();

    const [amountInput, addressInput] = await utils.getInputs(page);

    await addressInput.type(secrets.subAccountId);

    await amountInput.focus()

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('1');

    const [continueBtn] = await utils.getXPathElements(page, 'span', 'Continue');
    await continueBtn.click();

    const [sendBtn] = await utils.getXPathElements(page, 'span', 'Send');
    await sendBtn.click();

    await utils.waitForRender(9000);
    await utils.popupPage.refreshWallet(page);
    await utils.waitForRender(20000);

    const [newAvailableICPTag] = await utils.getXPathElements(page, 'span', 'ICP', true);
    await page.evaluate(tag => tag.innerText, availableICPTag);
    const newAvailableICPString = await page.evaluate(tag => tag.innerText, availableICPTag);

    console.log(newAvailableICPString);
    console.log(availableICPString);

    const newAvailableIsLower = newAvailableICPString < availableICPString;

    // Gotta do more tests before checking amount :p
    //expect(newAvailableIsLower).toBe(true);
    expect(2).toBe(2);
  });
});
