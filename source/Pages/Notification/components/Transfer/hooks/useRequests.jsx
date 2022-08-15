import React, { useState, useEffect } from 'react';
import { DataDisplay, AssetFormat } from '@components';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import { v4 as uuidv4 } from 'uuid';
import { CURRENCIES } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import PlugController from '@psychedelic/plug-controller';
import { Principal } from '@dfinity/principal';
import { validatePrincipalId } from '@shared/utils/ids';
import { DEFAULT_ICP_FEE } from '@shared/constants/addresses';
import { reviewPendingTransaction } from '@modules/storageManager';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const useRequests = (incomingRequests, callId, portId, transactionId) => {
  const { t } = useTranslation();
  const [currentRequest, setCurrentRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(incomingRequests);

  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);

  const [accountId, setAccountId] = useState(null);
  const [principalId, setPrincipalId] = useState(null);
  /* eslint-disable no-param-reassign */
  useEffect(() => {
    incomingRequests.map((item) => (
      { ...item, id: uuidv4() }
    ));

    const address = requests[currentRequest].to;

    if (validatePrincipalId(address)) {
      setPrincipalId(address);
      setAccountId(
        PlugController.getAccountId(
          Principal.fromText(address),
        ),
      );
    } else {
      setAccountId(address);
    }
  }, []);

  useEffect(async () => {
    if (requests.length === 0) {
      setLoading(true);
      const handler = response[0].token ? 'handleRequestTransferToken' : 'handleRequestTransfer';
      reviewPendingTransaction(transactionId, async () => {});
      const success = await portRPC.call(handler, [response, callId, portId, transactionId]);
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
    const handler = declinedRequests[0].token ? 'handleRequestTransferToken' : 'handleRequestTransfer';
    await Promise.all([
      reviewPendingTransaction(transactionId, async () => {}),
      portRPC.call(handler, [declinedRequests, callId, portId, transactionId]),
    ]);

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

  let config = [
    { label: 'accountId', value: shortAddress(accountId) },
    {
      label: 'fee',
      value: <AssetFormat value={requests[currentRequest]?.opts?.fee || DEFAULT_ICP_FEE} asset={CURRENCIES.get('ICP')?.value} />,
    },
    { label: 'memo', value: requests[currentRequest]?.opts?.memo || t('common.null') },
  ];
  if (principalId) {
    config = [{ label: 'principalId', value: shortAddress(principalId) }, ...config];
  }
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
    principalId,
    error,
    loading,
  };
};

export default useRequests;
