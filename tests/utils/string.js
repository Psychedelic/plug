// eslint-disable-next-line import/prefer-default-export
function formatTokenAmount(str = '') {
  return Number(str.slice(0, str.indexOf(' ')));
}

module.exports = {
  formatTokenAmount,
};
