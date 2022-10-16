import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useActivity } from '@hooks';
import { getTransactions } from '@redux/transactions';

import { useICPPrice } from '@redux/icp';
import LoadingWrapper from '../LoadingWrapper';
import ActivityItem from '../ActivityItem';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const Activity = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    transactions,
    loading: transactionsLoading,
  } = useSelector((state) => state.transactions);
  const activity = useActivity(transactions);
  const icpPrice = useICPPrice(true);

  useEffect(() => {
    icpPrice && dispatch(getTransactions());
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
