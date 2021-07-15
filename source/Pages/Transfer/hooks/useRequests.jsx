import React, { useState, useEffect } from 'react';
import { DataDisplay, AssetFormat } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import { v4 as uuidv4 } from 'uuid';
import { CURRENCIES } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import PlugController from '@psychedelic/plug-controller';
import { Principal } from '@dfinity/agent';
import { validatePrincipalId } from '@shared/utils/ids';
import { DEFAULT_FEE } from '@shared/constants/addresses';
import { setAssets, setTransactions } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useDispatch } from 'react-redux';

const portRPC = new PortRPC({
  name: 'transfer-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const useRequests = (incomingRequests, callId, portId, icpPrice) => {
  const { t } = useTranslation();
  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState(incomingRequests);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [response, setResponse] = useState([]);

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
      if (response?.[0]?.status === 'declined') {
        await portRPC.call('handleRequestTransfer', [{ ok: false, error: 'The transaction was rejected' }, callId, portId]);
        window.close();
      } else {
        sendMessage({
          type: HANDLER_TYPES.SEND_ICP,
          params: response?.[0],
        }, async (sendResponse) => {
          const { error, assets: keyringAssets, transactions } = sendResponse || {};
          if (!error) {
            dispatch(setAssets(keyringAssets));
            dispatch(setTransactions({ ...transactions, icpPrice }));
          }
          await portRPC.call('handleRequestTransfer', [{ ok: !error, error, response: sendResponse }, callId, portId]);
          setLoading(false);
          window.close();
        });
      }
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

  const data = [];

  if (principalId) {
    data.push({
      label: t('common.principalId'),
      component: <DataDisplay value={shortAddress(principalId)} />,
    });
  }

  if (accountId) {
    data.push({
      label: t('common.accountId'),
      component: <DataDisplay value={shortAddress(accountId)} />,
    });
  }

  data.push(...[
    {
      label: t('common.fee'),
      component: <DataDisplay value={<AssetFormat value={requests[currentRequest]?.args?.fee || DEFAULT_FEE} asset={CURRENCIES.get('ICP').value} />} />,
    },
    {
      label: t('common.memo'),
      component: <DataDisplay value={requests[currentRequest]?.args?.memo || t('common.null')} />,
    },
  ]);

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRequest,
    handleDeclineAll,
    principalId,
    loading,
  };
};

export default useRequests;
