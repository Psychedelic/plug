import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import extension from 'extensionizer';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { removeAppByURL } from '@shared/utils/apps';

const storage = extension.storage.local;

const useApps = () => {
  const [apps, setApps] = useState({});
  const [parsedApps, setParsedApps] = useState([]);
  const { walletNumber } = useSelector((state) => state.wallet);

  const handleRemoveApp = (url) => {
    const newApps = removeAppByURL({ apps, url });

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
    storage.set({
      [walletNumber]: { apps },
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
