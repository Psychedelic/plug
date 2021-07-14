import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_FEE } from '../../../Popup/Views/Send/hooks/constants';

const portRPC = new PortRPC({
  name: 'transfer-port',
  target: 'bg-script',
  timeout: 5000,
});

portRPC.start();

const useRequests = (incomingRequests, callId, portId) => {
  const { t } = useTranslation();

  /* eslint-disable no-param-reassign */
  useEffect(() => {
    incomingRequests.map((item) => (
      { ...item, id: uuidv4() }
    ));
  }, []);

  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState(incomingRequests);

  const [response, setResponse] = useState([]);

  useEffect(async () => {
    if (requests.length === 0) {
      await portRPC.call('handleRequestTransfer', [response, callId, portId]);
      window.close();
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleDeclineAll = async () => {
    const declinedRequests = requests.map((r) => ({ ...r, status: 'declined' }));
    await portRPC.call('handleRequestTransfer', [declinedRequests, callId, portId]);
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

  const data = [
    {
      label: t('common.accountId'),
      component: <DataDisplay value={requests[currentRequest].to} />,
    },
    {
      label: t('common.fee'),
      component: <DataDisplay value={requests[currentRequest].args?.fee || DEFAULT_FEE} />,
    },

    {
      label: t('common.memo'),
      component: <DataDisplay value={requests[currentRequest].args?.memo || t('common.null')} />,
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
