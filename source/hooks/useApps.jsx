import { useEffect, useState } from 'react';
import extension from 'extensionizer';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import plugProvider from '../Inpage/index';

const storage = extension.storage.local;

const useApps = () => {
  const [apps, setApps] = useState({});
  const [parsedApps, setParsedApps] = useState([]);

  const handleRemoveApp = (url) => {
    const filteredApps = Object.keys(apps)
      .filter((key) => apps[key].url !== url)
      .reduce((obj, key) => {
        const newObj = obj;
        newObj[key] = apps[key];
        return newObj;
      }, {});

    setApps(filteredApps);
    plugProvider.deleteAgent();
  };

  useEffect(() => {
    storage.get('apps', (state) => {
      const lsApps = state.apps;
      if (lsApps) {
        setApps(lsApps);
      }
    });
  }, []);

  useEffect(() => {
    storage.set({
      apps,
    });

    const parsed = Object.values(apps);
    const filtered = parsed.filter((a) => a.status === CONNECTION_STATUS.accepted);
    setParsedApps(filtered);
  }, [apps]);

  return {
    parsedApps,
    removeApp: handleRemoveApp,
  };
};

export default useApps;
