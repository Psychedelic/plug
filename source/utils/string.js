export const capitalize = (str) => (str?.length > 0 ? `${str[0].toUpperCase()}${str?.slice(1)}` : '');
export default { capitalize }; // remove when others are added.
