import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@components';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import ReactJson from 'react-json-view';
// import { v4 as uuidv4 } from 'uuid';
import { validateCanisterId } from '@shared/utils/ids';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { reviewPendingTransaction } from '@modules/storageManager';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const formatRequest = ({
  requestInfo, canisterInfo, payload, host,
}) => ({
  type: requestInfo.type || 'sign',
  canisterId: requestInfo.canisterId,
  methodName: requestInfo.methodName,
  sender: requestInfo.sender,
  arguments: requestInfo.arguments,
  canisterName: canisterInfo.name,
  canisterDescription: canisterInfo.description,
  canisterIcon: canisterInfo.icon,
  canisterUrl: canisterInfo.url,
  decodedArguments: requestInfo.decodedArguments,
  category: canisterInfo?.category,
  payload,
  host,
});

const useRequests = (incomingRequest, callId, portId, transactionId) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [request] = useState(formatRequest(incomingRequest));
  const [error, setError] = useState(false);

  const [canisterId, setCanisterId] = useState(null);
  /* eslint-disable no-param-reassign */
  useEffect(() => {
    const address = request.cansiterId;
    if (validateCanisterId(address)) {
      setCanisterId(address);
    }
  }, []);

  const handleResponse = async (status) => {
    request.status = status;
    const handler = request.type === 'sign' ? 'handleSign' : 'handleCall';
    reviewPendingTransaction(transactionId, async () => {});
    const success = await portRPC.call(handler, [status, request, callId, portId, transactionId]);
    if (success) {
      window.close();
    }
    setError(!success);
    setLoading(false);
    window.close();
  };

  const handleAccept = () => handleResponse(CONNECTION_STATUS.accepted);

  const handleDecline = () => handleResponse(CONNECTION_STATUS.rejected);

  const data = [
    { label: t('common.canisterId'), component: <DataDisplay value={request.canisterId} /> },
    {
      label: t('common.methodName'),
      component: <DataDisplay value={request.methodName} />,
    },
    {
      label: t('common.arguments'),
      withArguments: !!request?.decodedArguments,
      component: request.decodedArguments
        ? (
          <ReactJson
            src={request.decodedArguments}
            collapsed={2}
            style={{
              backgroundColor: '#F3F4F6',
              padding: '10px',
              borderRadius: '10px',
              minHeight: '185px',
              maxHeight: '185px',
              overflow: 'auto',
            }}
          />
        )
        : <DataDisplay value="Unknown" warn />,
    },
  ];

  return {
    request,
    data,
    handleAccept,
    handleDecline,
    canisterId,
    error,
    loading,
  };
};

export default useRequests;
