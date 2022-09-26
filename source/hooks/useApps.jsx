import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { addDisconnectedEntry } from '@shared/utils/apps';
import { getApps, setApps as setStorageApps } from '@modules';

const useApps = () => {
  const [apps, setApps] = useState({});
  const [parsedApps, setParsedApps] = useState([]);
  const [historicApps, setHistoricApps] = useState([]);
  const { walletId } = useSelector((state) => state.wallet);

  const handleRemoveApp = (appUrl) => {
    const newApps = addDisconnectedEntry({ apps, appUrl });
    setApps(newApps);
  };

  useEffect(() => {
    getApps(walletId, (appsFromExtensionStorage = {}) => {
      if (appsFromExtensionStorage) {
        setApps(appsFromExtensionStorage);
      }
    });
  }, [walletId]);

  useEffect(() => {
    setStorageApps(walletId, apps);
    const parsed = Object.values(apps) || [];

    const allEvents = parsed?.flatMap((app) => app?.events?.map((event) => ({
      date: event?.date,
      status: event?.status,
      icon: app?.icon,
      name: app?.name,
      url: app?.url,
      whitelist: app?.whitelist,
    })));

    const filtered = parsed?.filter((a) => a?.status === CONNECTION_STATUS.accepted) || [];
    const historic = allEvents?.filter((a) => a?.status === CONNECTION_STATUS.accepted
      || CONNECTION_STATUS.disconnected) || [];

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
