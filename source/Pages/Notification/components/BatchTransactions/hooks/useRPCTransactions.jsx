import React, { useState, useMemo } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import { v4 as uuidv4 } from 'uuid';

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

const useTransactions = (_transactions, callId, portId) => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const transactions = useMemo(() => {
    const transactionsWithIds = [
      ..._transactions.map((transaction) => ({ ...transaction, id: uuidv4 })),
    ];

    return transactionsWithIds;
  }, []);

  const process = async (status) => {
    setResponse([
      ...response,
      {
        ...transactions[currentIndex],
        status,
      },
    ]);

    transactions.filter(
      (transaction) => transaction.id !== transactions[currentIndex].id,
    );
  };

  const processAll = async (status) => {
    setLoading(true);
    const confirmedTransactions = _transactions.map((transaction) => ({
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

  const data = useMemo(() => {
    const config = [
      { label: 'canisterId', value: 'HERE_COMES_CANISTER_ID' },
      {
        label: 'methodName',
        value: transactions[currentIndex]?.methodName,
      },
      {
        label: 'parameters',
        value: transactions[currentIndex]?.args || t('common.null'),
      },
    ];

    return config.map(({ label, value }) => ({
      label: t(`common.${label}`),
      component: <DataDisplay value={value} />,
    }));
  }, []);

  return {
    showNext,
    showPrevious,
    confirm,
    decline,
    confirmAll,
    declineAll,

    transactions,
    currentIndex,

    data,
    error,
    loading,
  };
};

export default useTransactions;
