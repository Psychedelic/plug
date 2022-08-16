import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

import { useActivity } from '@hooks';
import { setTransactions, setTransactionsLoading } from '@redux/wallet';
import { useICPPrice } from '@redux/icp';
import LoadingWrapper from '../LoadingWrapper';
import ActivityItem from '../ActivityItem';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const Activity = () => {
  const classes = useStyles();
  const { transactions, transactionsLoading } = useSelector((state) => state.wallet);
  const { useICNS } = useSelector((state) => state.icns);
  const dispatch = useDispatch();
  const activity = useActivity(transactions);

  const icpPrice = useICPPrice(true);

  useEffect(() => {
    if (icpPrice) {
      dispatch(setTransactionsLoading(true));
      sendMessage({ type: HANDLER_TYPES.GET_TRANSACTIONS, params: {} },
        (trxs) => {
          dispatch(setTransactions({ ...trxs, icpPrice, useICNS }));
          dispatch(setTransactionsLoading(false));
        });
    }
  }, [icpPrice]);
  return (
    <LoadingWrapper loading={!transactions?.length && transactionsLoading} className="big">
      <div className={classes.root}>
        {
          activity && activity?.length > 0
            ? activity.map((item, index) => (
              <ActivityItem key={`${index.toString()}-${item.type}`} {...item} />
            ))
            : <EmptyState />
        }
      </div>
    </LoadingWrapper>
  );
};

export default Activity;
