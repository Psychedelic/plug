import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import extension from 'extensionizer';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { removeAppByURL } from '@shared/utils/apps';

const storage = extension.storage.local;

const useApps = (showAll = false) => {
  const [apps, setApps] = useState({});
  const [parsedApps, setParsedApps] = useState([]);
  const [historicApps, setHistoricApps] = useState([]);
  const { walletNumber } = useSelector((state) => state.wallet);

  const handleRemoveApp = (url) => {
    const date = new Date().toISOString();

    const newApps = {
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
          }
        ]
      },
    };
    setApps(newApps);
  };

  useEffect(() => {
    storage.get(walletNumber?.toString(), (state) => {
      const appsFromExtensionStorage = state?.[walletNumber]?.apps;
      if (appsFromExtensionStorage) {
        setApps(appsFromExtensionStorage);
      }
    });
  }, [walletNumber]);

  useEffect(() => {
    console.log('apps', apps)
    storage.set({
      [walletNumber]: { apps },
    });
    const parsed = Object.values(apps);
    console.log('parsed', parsed)

    const allEvents = parsed.flatMap(app =>
      app.events.map(event => {
        return {
          date: event.date,
          status: event.status,
          icon: app.icon,
          name: app.name,
          url: app.url,
          whitelist: app.whitelist
        }
      })
    );

    console.log('allEvents', allEvents);

    const filtered = parsed.filter((a) => a.status === CONNECTION_STATUS.accepted);
    const historic = allEvents.filter((a) => a.status === CONNECTION_STATUS.accepted || CONNECTION_STATUS.disconnected);

    setParsedApps(filtered);
    setHistoricApps(historic);
  }, [apps]);

  return {
    parsedApps,
    removeApp: handleRemoveApp,
    historicApps,
  };
};

export default useApps;
