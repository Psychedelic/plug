import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityItem } from '@ui';

import { getTransactions } from '../../redux/wallet';
import useStyles from './styles';

const Activity = () => {
  const classes = useStyles();
  const { transactions } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTransactions());
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
