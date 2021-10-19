const SIZES = {
  width: 436,
  detailsNormalHeight: 493,
  detailsWarningHeight: 795,
  dataHeight: 530,
  dataWithArgumentsHeight: 680,
  assetsHeight: 565,
  nftHeight: 565,
  canisterInfoHeight: 495,
  canisterInfoWarning: 740,
};

export const WARNING_LINKS = {
  twitter: (url, canisterName) => `https://twitter.com/intent/tweet?text=Hey ${url}. Interacting with ${canisterName} on your app feels unsafe (I can't see all the info). Can you please fix this 🙏`,
  discord: 'https://discord.gg/fleekhq',
  docs: 'https://docs.plugwallet.ooo/resources/app-trust-and-security/',
};

export default SIZES;
