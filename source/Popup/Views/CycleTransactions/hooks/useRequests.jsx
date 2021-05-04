import React, { useState } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';

const REQUESTS = [
  {
    id: 0,
    url: 'https://fleek1.xyz',
    cycles: 2.5,
    canisterId: 'rwlgt-iiaaa-aaaaa-aaaaa-cai',
    methodName: 'Withdraw',
    parameters: '[\n  {\n    types: unit 256',
  },
  {
    id: 1,
    url: 'https://fleek2.xyz',
    cycles: 420,
    canisterId: '22222-22222-222222-222222-222222',
    methodName: 'Withdraw',
    parameters: '[\n  {\n    types: unit 256',
  },
  {
    id: 2,
    url: 'https://fleek3.xyz',
    cycles: 1337,
    canisterId: '33333-33333-33333-33333-333333',
    methodName: 'Withdraw',
    parameters: '[\n  {\n    types: unit 256',
  },
];

const useRequests = () => {
  const { t } = useTranslation();

  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState(REQUESTS);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleRemoveRequest = (id) => {
    setCurrentRequest(0);
    setRequests(requests.filter((r) => r.id !== id));
  };

  const data = [
    {
      label: t('cycleTransactions.canisterId'),
      component: <DataDisplay value={requests[currentRequest].canisterId} />,
    },
    {
      label: t('cycleTransactions.methodName'),
      component: <DataDisplay value={requests[currentRequest].methodName} />,
    },
    {
      label: t('cycleTransactions.parameters'),
      component: <DataDisplay value={requests[currentRequest].parameters} big />,
    },
  ];

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRemoveRequest,
  };
};

export default useRequests;
