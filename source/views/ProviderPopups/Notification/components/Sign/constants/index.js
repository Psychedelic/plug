const SIZES = {
  width: 436,
  detailsNormalHeight: 493,
  detailsWarningHeight: 795,
  dataHeight: 530,
  dataWithArgumentsHeight: 680,
  assetsHeight: 550,
  nftHeight: 565,
  canisterInfoHeight: 550,
  canisterInfoWarning: 790,
  batchTransactions: 760,
  batchTransactionsScroll: 780,
  dataTabs: 70,
};

export const WARNING_LINKS = {
  twitter: (url, name) => `https://twitter.com/intent/tweet?text=Hey ${url}. Interacting with ${name} on your app feels unsafe (I can't see all the info). Can you please fix this 🙏`,
  discord: 'https://discord.gg/fleekhq',
  docs: 'https://docs.plugwallet.ooo/resources/app-trust-and-security/',
};

export default SIZES;
