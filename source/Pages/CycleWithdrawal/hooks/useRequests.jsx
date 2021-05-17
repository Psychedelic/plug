import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';

const portRPC = new PortRPC({
  name: 'cycle-withdrawal-port',
  target: 'bg-script',
  timeout: 5000,
});

portRPC.start();

const useRequests = (incomingRequests, callId, portId) => {
  const { t } = useTranslation();

  /* eslint-disable no-param-reassign */
  useEffect(() => {
    incomingRequests.forEach((item, i) => {
      item.id = i;
    });
  }, []);

  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState(incomingRequests);

  const [response, setResponse] = useState([]);

  useEffect(async () => {
    if (requests.length === 0) {
      await portRPC.call('handleCycleWithdrawal', [response, callId, portId]);
      window.close();
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleDeclineAll = async () => {
    const declinedRequests = requests.map((r) => ({ ...r, status: 'declined' }));
    await portRPC.call('handleCycleWithdrawal', [declinedRequests, callId, portId]);
    window.close();
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
      component: <DataDisplay value={validData('parameters')} big />,
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
  };
};

export default useRequests;
