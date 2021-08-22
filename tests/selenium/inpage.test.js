jest.setTimeout(40000);

describe("Inpage Selenium test", () => {
  let chromeDriver;
  let firefoxDriver;

  beforeAll(async () => {
    [chromeDriver, firefoxDriver] = await global.getDrivers();
  });

  afterAll(() => {
    global.closeDriver([chromeDriver, firefoxDriver]);
  });

  /*
  it.each`
    name    | driver
    Chrome  | ${chromeDriver}
    Firefox | ${firefoxDriver}
  `('Checks inpage title in $name', async (props) => {
    await driver.get('chrome-extension://cohinjcejkglcocbjgadilaagoelogdh/options.html');

    const title = await driver.getTitle();
    expect(title).toBe('Plug');
  })
  */

  it('Checks inpage title', async function() {
    await chromeDriver.get('chrome-extension://cohinjcejkglcocbjgadilaagoelogdh/options.html');

    const title = await chromeDriver.getTitle();
    expect(title).toBe('Plug');
  });
});
