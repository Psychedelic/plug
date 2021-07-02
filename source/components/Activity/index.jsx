import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import extension from 'extensionizer';
import { ActivityItem } from '@ui';
import { HANDLER_TYPES } from '@background/Keyring';

import { setTransactions } from '../../redux/wallet';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const Activity = () => {
  const classes = useStyles();
  const { transactions } = useSelector((state) => state.wallet);
  const { icpPrice } = useSelector((state) => state.icp);
  const dispatch = useDispatch();

  useEffect(() => {
    if (icpPrice) {
      extension.runtime.sendMessage({ type: HANDLER_TYPES.GET_TRANSACTIONS, params: {} },
        (trxs) => {
          dispatch(setTransactions({ ...trxs, icpPrice }));
        });
    }
  }, [icpPrice]);
  return (
    <div className={classes.root}>
      {
        transactions && transactions.length > 0
          ? transactions.map((item) => (
            <ActivityItem {...item} />
          ))
          : <EmptyState />
      }
    </div>
  );
};

export default Activity;
