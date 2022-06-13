// eslint-disable-next-line import/prefer-default-export
function getTokenAmount(str = '') {
  return Number(str.slice(0, str.indexOf(' ')));
}

module.exports = {
  getTokenAmount,
};
