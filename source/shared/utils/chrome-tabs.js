const beautifyUrl = (url) => (
  url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
);

export const getTabURL = (tab) => {
  if (!tab?.url) return '';
  const url = new URL(tab.url);
  return beautifyUrl(url.host);
};

export default { getTabURL };
