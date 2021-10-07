// eslint-disable-next-line
export const removeAppByURL = ({ apps, url }) => {
  const filteredApps = Object.keys(apps)
    .filter((appKey) => apps[appKey].url !== url)
    .reduce((accumulator, appKey) => {
      const newApps = { ...accumulator };
      newApps[appKey] = apps[appKey];
      return newApps;
    }, {});

  return filteredApps;
};
