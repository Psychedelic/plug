import React, { useState, useMemo } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const TRANSACTION_STATUS = {
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
};

const useTransactions = (transactions, callId, portId) => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const processAll = async (status) => {
    setLoading(true);
    const confirmedTransactions = transactions.map((transaction) => ({
      ...transaction,
      status,
    }));

    const isSucceed = await portRPC.call('handleBatchTransactions', [
      confirmedTransactions,
      callId,
      portId,
    ]);

    if (isSucceed) {
      window.close();
    }

    setError(!isSucceed);
    setLoading(false);
  };

  const process = async (status) => {
    setResponse([
      ...response,
      {
        ...transactions[currentIndex],
        status,
      },
    ]);

    if (response.length + 1 === transactions.length) {
      await processAll(status);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const confirm = () => process(TRANSACTION_STATUS.CONFIRMED);
  const decline = () => process(TRANSACTION_STATUS.DECLINED);
  const confirmAll = () => processAll(TRANSACTION_STATUS.CONFIRMED);
  const declineAll = () => processAll(TRANSACTION_STATUS.DECLINED);

  const showNext = () => {
    setCurrentIndex(currentIndex + 1);
  };
  const showPrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const stringifiedArgs = useMemo(() => JSON.stringify(transactions[currentIndex]?.args ?? {}), []);

  const data = useMemo(() => {
    const config = [
      { label: 'canisterId', value: 'HERE_COMES_CANISTER_ID' },
      {
        label: 'methodName',
        value: transactions[currentIndex]?.methodName,
      },
      {
        label: 'parameters',
        value: stringifiedArgs || t('common.null'),
      },
    ];

    return config.map(({ label, value }) => ({
      label: t(`common.${label}`),
      component: <DataDisplay value={value} />,
    }));
  }, [currentIndex]);

  return {
    showNext,
    showPrevious,
    confirm,
    decline,
    confirmAll,
    declineAll,

    response,
    transactions,
    currentIndex,

    data,
    error,
    loading,
  };
};

export default useTransactions;
