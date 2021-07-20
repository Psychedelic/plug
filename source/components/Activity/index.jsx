import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityItem } from '@ui';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

import LoadingWrapper from '@components/LoadingWrapper';
import { useActivity } from '@hooks';
import { setTransactions } from '../../redux/wallet';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const Activity = () => {
  const classes = useStyles();
  const { transactions } = useSelector((state) => state.wallet);
  const [transactionsLoading, setLoading] = useState(true);
  const { icpPrice } = useSelector((state) => state.icp);
  const dispatch = useDispatch();
  const activity = useActivity(transactions);

  useEffect(() => {
    if (icpPrice) {
      sendMessage({ type: HANDLER_TYPES.GET_TRANSACTIONS, params: {} },
        (trxs) => {
          dispatch(setTransactions({ ...trxs, icpPrice }));
          setLoading(false);
        });
    }
  }, [icpPrice]);
  return (
    <LoadingWrapper loading={!transactions.length && transactionsLoading}>
      <div className={classes.root}>
        {
          activity && activity.length > 0
            ? activity.map((item, index) => (
              <ActivityItem key={index.toString()} {...item} />
            ))
            : <EmptyState />
        }
      </div>
    </LoadingWrapper>
  );
};

export default Activity;
