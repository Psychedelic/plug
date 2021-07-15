import { useEffect, useState } from 'react';
import extension from 'extensionizer';

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

    setParsedApps(Object.values(apps));
  }, [apps]);

  return {
    parsedApps,
    removeApp: handleRemoveApp,
  };
};

export default useApps;
