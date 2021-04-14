export const shortenString = (str) => {
  if (!str) return str;
  if (str.length > 23) {
    return `${str.substr(0, 11)}...${str.substr(str.length - 9, str.length)}`;
  }
  return str;
};

export default {};
