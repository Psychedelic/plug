import React from 'react';
import { ActivityItem } from '@ui';
import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '@shared/constants/activity';
import { CURRENCIES } from '@shared/constants/currencies';
import FleekImg from '@assets/icons/Fleek.svg';
import useStyles from './styles';

const ACTIVITIES = [
  {
    type: ACTIVITY_TYPES.SEND,
    currency: CURRENCIES.ICP,
    wallet: 'rwlgt...ii-cai',
    amount: -182.27,
    value: 2129.12,
    status: ACTIVITY_STATUS.DONE,
    date: 'Apr 12',
    plug: null,
  },
  {
    type: ACTIVITY_TYPES.RECEIVE,
    currency: CURRENCIES.ICP,
    wallet: 'rwlgt...ii-cai',
    amount: 182.27,
    value: 2129.12,
    status: ACTIVITY_STATUS.DONE,
    date: 'Apr 12',
    plug: null,
  },
  {
    type: ACTIVITY_TYPES.SWAP,
    currency: CURRENCIES.ICP,
    wallet: null,
    amount: -182.27,
    value: -2129.12,
    status: ACTIVITY_STATUS.DONE,
    date: 'Apr 12',
    plug: null,
    swapData: {
      currency: CURRENCIES.CYCLES,
      amount: 1337420.69,
      value: 2129.12,
      status: ACTIVITY_STATUS.DONE,
      date: 'Apr 12',
    },
  },
  {
    type: ACTIVITY_TYPES.PLUG,
    currency: null,
    wallet: null,
    amount: null,
    value: null,
    status: ACTIVITY_STATUS.DONE,
    date: 'Apr 12',
    plug: {
      name: 'fleek.ooo',
      image: FleekImg,
    },
  },
  {
    type: ACTIVITY_TYPES.SEND,
    currency: CURRENCIES.ICP,
    wallet: 'rwlgt...ii-cai',
    amount: -182.27,
    value: 2129.12,
    status: ACTIVITY_STATUS.PENDING,
    date: 'Apr 12',
    plug: null,
  },
  {
    type: ACTIVITY_TYPES.SEND,
    currency: CURRENCIES.ICP,
    wallet: 'rwlgt...ii-cai',
    amount: -182.27,
    value: 2129.12,
    status: ACTIVITY_STATUS.FAILED,
    date: 'Apr 12',
    plug: null,
  },
];

const Activity = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        ACTIVITIES.map((item) => (
          <ActivityItem {...item} />
        ))
      }
    </div>
  );
};

export default Activity;
