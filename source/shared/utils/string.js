export const capitalize = (str) => (str?.length > 0 ? `${str[0].toUpperCase()}${str?.slice(1)}` : '');

export const unCamelCase = (str) => {
  const separated = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .toLowerCase();

  return `${separated?.[0]?.toUpperCase()}${separated?.slice(1)}`;
}
