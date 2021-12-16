import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';

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

export const addDisconnectedEntry = ({ apps, url }) => {
  const date = new Date().toISOString();
  return {
    ...apps,
    [url]: {
      ...apps[url],
      status: CONNECTION_STATUS.disconnected,
      date,
      events: [
        ...apps[url].events,
        {
          status: CONNECTION_STATUS.disconnected,
          date,
        },
      ],
    },
  };
};
