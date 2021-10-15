import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
// import { v4 as uuidv4 } from 'uuid';
import { validateCanisterId } from '@shared/utils/ids';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const formatRequest = ({ requestInfo, canisterInfo, payload }) => ({
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
});

const useRequests = (incomingRequest, callId, portId) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [request] = useState(formatRequest(incomingRequest));
  const [response, setResponse] = useState([]);
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

    const success = await portRPC.call('handleSign', [status, request.payload, callId, portId]);
    if (success) {
      window.close();
    }
    setError(!success);
    setLoading(false);
    window.close();

    setResponse(status);
  };

  const handleAccept = () => handleResponse(CONNECTION_STATUS.accepted);

  const handleDecline = () => handleResponse(CONNECTION_STATUS.rejected);

  const config = [
    { label: 'canisterId', value: request.canisterId },
    {
      label: 'methodName',
      value: request.methodName,
    },
    {
      label: 'arguments',
      value: request.decodedArguments || 'UNKNOWN',
    },
  ];

  const data = config.map(({ label, value }) => (
    {
      label: t(`common.${label}`),
      component: <DataDisplay value={value} />,
    }
  ));

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
