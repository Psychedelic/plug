export const capitalize = (str) => (str?.length > 0 ? `${str[0].toUpperCase()}${str?.slice(1)}` : '');
export const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export default { capitalize }; // remove when others are added.
