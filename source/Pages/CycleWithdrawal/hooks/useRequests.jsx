import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import extension from 'extensionizer';
import { useBeforeunload } from 'react-beforeunload';

const portRPC = new PortRPC({
  name: 'cycle-withdrawal-port',
  target: 'bg-script',
  timeout: 5000,
});

portRPC.start();

const storage = extension.storage.local;

const useRequests = (callId, portId) => {
  const { t } = useTranslation();

  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateRequests = () => {
    storage.get(['requests'], (state) => {
      const storedRequests = state.requests;

      const ids = requests.map((r) => r.id);

      if (storedRequests) {
        setRequests(
          [
            ...requests,
            ...storedRequests.filter((sr) => sr.status === 'pending' && !ids.includes(sr.id)),
          ],
        );
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateRequests();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(async () => {
    if (requests.length > 0 && loading) setLoading(false);

    if (requests.length === 0 && !loading) {
      await portRPC.call('handleDankProxyRequest', [callId, portId]);

      window.close();
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleRequest = (id, status) => {
    storage.get(['requests'], (state) => {
      const storedRequests = state.requests;

      const selectedRequest = storedRequests.find((r) => r.id === id);
      selectedRequest.status = status;

      storage.set({
        requests: storedRequests,
      });
    });

    setCurrentRequest(0);
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleDeclineAll = () => {
    storage.get(['requests'], (state) => {
      const ids = requests.map((r) => r.id);

      const storedRequests = state.requests.map((sr) => ({ ...sr, status: ids.includes(sr.id) ? 'declined' : sr.status }));

      console.log('storedRequests', storedRequests);

      storage.set({
        requests: storedRequests,
      });
    });

    setRequests([]);
  };

  const requestCount = requests.length;

  const validData = (property) => (
    requestCount > 0
      ? requests[currentRequest][property]
      : ''
  );

  const data = [
    {
      label: t('cycleTransactions.canisterId'),
      component: <DataDisplay value={validData('canisterId')} />,
    },
    {
      label: t('cycleTransactions.methodName'),
      component: <DataDisplay value={validData('methodName')} />,
    },
    {
      label: t('cycleTransactions.parameters'),
      component: <DataDisplay value={JSON.stringify(validData('args'))} big />,
    },
  ];

  useBeforeunload(() => {
    handleDeclineAll();

    storage.set({
      open: false,
    });
  });

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRequest,
    handleDeclineAll,
    loading,
  };
};

export default useRequests;
