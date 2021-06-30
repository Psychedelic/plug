import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import extension from 'extensionizer';

import { ActivityItem } from '@ui';
import { setTransactions } from '../../redux/wallet';
import useStyles from './styles';

const Activity = () => {
  const classes = useStyles();
  const { transactions } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    extension.runtime.sendMessage({ type: 'get-keyring-transactions', params: {} },
      (trxs) => {
        dispatch(setTransactions(trxs));
      });
  }, []);

  return (
    <div className={classes.root}>
      {
        transactions.map((item) => (
          <ActivityItem {...item} />
        ))
      }
    </div>
  );
};

export default Activity;
