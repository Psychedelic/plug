import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import extension from 'extensionizer';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import plugProvider from '../Inpage/index';

const storage = extension.storage.local;

const useApps = () => {
  const [apps, setApps] = useState({});
  const [parsedApps, setParsedApps] = useState([]);
  const { walletNumber } = useSelector((state) => state.wallet);

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
    storage.get(walletNumber?.toString(), (state) => {
      const lsApps = state?.[walletNumber]?.apps;
      if (lsApps) {
        setApps(lsApps);
      }
    });
  }, [walletNumber]);

  useEffect(() => {
    storage.set({
      [walletNumber]: { apps },
    });
    const parsed = Object.values(apps);
    const filtered = parsed.filter((a) => a.status === CONNECTION_STATUS.accepted);
    setParsedApps(filtered);
  }, [apps, walletNumber]);
  return {
    parsedApps,
    removeApp: handleRemoveApp,
  };
};

export default useApps;
