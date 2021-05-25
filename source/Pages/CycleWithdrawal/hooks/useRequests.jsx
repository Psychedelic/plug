import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import extension from 'extensionizer';

const portRPC = new PortRPC({
  name: 'cycle-withdrawal-port',
  target: 'bg-script',
  timeout: 5000,
});

portRPC.start();

const storage = extension.storage.local;

const useRequests = (site, callId, portId) => {
  const { t } = useTranslation();

  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState([]);
  const [response, setResponse] = useState([]);
  const [metadata, setMetadata] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.get([site], (state) => {
      setMetadata(state[site]);
    });

    storage.get(['requests'], (state) => {
      const storedRequests = state.requests;

      if (storedRequests) {
        setRequests(
          storedRequests.filter((sr) => sr.status === 'pending' && sr.url === site),
        );
      }
    });
  }, []);

  useEffect(async () => {
    if (metadata && requests) setLoading(false);
  }, [metadata, requests]);

  useEffect(async () => {
    if (requests.length === 0 && !loading) {
      storage.set({
        requests: response, // i think doing this is not right
      });

      await portRPC.call('handleDankProxyRequest', [site, callId, portId]);
      window.close();
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleDeclineAll = async () => {
    const declinedRequests = requests.map((r) => ({ ...r, status: 'declined' }));

    setResponse([
      ...response,
      ...declinedRequests,
    ]);

    setRequests([]);
  };

  const handleRequest = async (request, status) => {
    request.status = status;

    setResponse([
      ...response,
      request,
    ]);

    setCurrentRequest(0);
    setRequests(requests.filter((r) => r.id !== request.id));
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

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRequest,
    handleDeclineAll,
    metadata,
    loading,
  };
};

export default useRequests;
