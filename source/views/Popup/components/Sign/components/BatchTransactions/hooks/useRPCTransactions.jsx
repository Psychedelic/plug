import React, { useState, useMemo } from 'react';
import { DataDisplay } from '@components';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import ReactJson from 'react-json-view';
import { reviewPendingTransaction } from '@modules/storageManager';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const formatTransaction = ({ transaction }) => ({
  canisterId: transaction.canisterId,
  methodName: transaction.methodName,
  sender: transaction.sender,
  arguments: transaction.arguments,
  canisterName: transaction?.canisterInfo?.name,
  canisterDescription: transaction?.canisterInfo?.description,
  canisterIcon: transaction?.canisterInfo?.icon,
  canisterUrl: transaction?.canisterInfo?.url,
  decodedArguments: transaction.decodedArguments,
  category: transaction?.canisterInfo?.category,
});

const useTransactions = (transactions, callId, portId, transactionId) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const processAll = async (accepted) => {
    setLoading(true);
    reviewPendingTransaction(transactionId, (res) => res);
    await portRPC.call('handleBatchTransactions', [
      accepted,
      transactions,
      callId,
      portId,
      transactionId,
    ]);
    setLoading(false);
    window.close();
  };

  const confirm = () => processAll(true);
  const decline = () => processAll(false);

  const data = useMemo(() => transactions.map((tx) => {
    const transaction = formatTransaction({ transaction: tx });
    const formItems = [
      { label: t('common.canisterId'), component: <DataDisplay value={transaction?.canisterId} /> },
      {
        label: t('common.methodName'),
        component: <DataDisplay value={transaction?.methodName} />,
      },
      {
        label: t('common.arguments'),
        component: <ReactJson
          src={transaction?.decodedArguments}
          collapsed={2}
          style={{
            backgroundColor: '#F3F4F6',
            padding: '10px',
            borderRadius: '10px',
            minHeight: '185px',
            maxHeight: '185px',
            overflow: 'auto',
          }}
        />,
      },
    ];
    return { transaction, formItems };
  }), [transactions]);

  return {
    confirm,
    decline,

    transactions: transactions.map((tx) => formatTransaction({ transaction: tx })),

    data,
    loading,
  };
};

export default useTransactions;
