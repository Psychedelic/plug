import React, { useState, useEffect } from 'react';
import { DataDisplay, AssetFormat } from '@components';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import { v4 as uuidv4 } from 'uuid';
import { CURRENCIES } from '@shared/constants/currencies';
import { validateCanisterId } from '@shared/utils/ids';
import { XTC_FEE } from '@shared/constants/addresses';
import { reviewPendingTransaction } from '@modules/storageManager';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 40000,
});

portRPC.start();

const useRequests = (incomingRequests, callId, portId, transactionId) => {
  const { t } = useTranslation();
  const [currentRequest, setCurrentRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(incomingRequests);

  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);

  const [canisterId, setCanisterId] = useState(null);
  /* eslint-disable no-param-reassign */
  useEffect(() => {
    incomingRequests.map((item) => (
      { ...item, id: uuidv4() }
    ));

    const address = requests[currentRequest].to;

    if (validateCanisterId(address)) {
      setCanisterId(address);
    }
  }, []);

  useEffect(async () => {
    if (requests.length === 0) {
      setLoading(true);
      reviewPendingTransaction(transactionId, async () => {});
      const success = await portRPC.call('handleRequestBurnXTC', [response, callId, portId, transactionId]);
      if (success) {
        window.close();
      }
      setError(!success);
      setLoading(false);
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleDeclineAll = async () => {
    const declinedRequests = requests.map((r) => ({ ...r, status: 'declined' }));
    reviewPendingTransaction(transactionId, async () => {});
    await portRPC.call('handleRequestBurnXTC', [declinedRequests, callId, portId, transactionId]);
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

  const config = [
    { label: 'canisterId', value: canisterId },
    {
      label: 'fee',
      value: <AssetFormat value={XTC_FEE} asset={CURRENCIES.get('XTC')?.value} />,
    },
  ];

  const data = config.map(({ label, value }) => (
    {
      label: t(`common.${label}`),
      component: <DataDisplay value={value} />,
    }
  ));

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRequest,
    handleDeclineAll,
    canisterId,
    error,
    loading,
  };
};

export default useRequests;
