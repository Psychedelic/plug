const fillSeedPhraseInput = async (page, seedPhrase) => {
  const seedArray = seedPhrase.trim().split(' ');
  for (let i = 0; i < seedArray.length; i += 1) {
    const seedPhraseInput = await page.getByTestId(`seedphrase-input-${i + 1}`);
    await seedPhraseInput.click();
    await seedPhraseInput.type(seedArray[i]);
  }
};

module.exports = {
  fillSeedPhraseInput,
};
