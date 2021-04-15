import React from 'react';
import { ActionButton } from '@ui';
import useStyles from './styles';

const ACTIONS = [
  {
    type: 'deposit',
    onClick: (() => null),
  },
  {
    type: 'send',
    onClick: (() => null),
  },
  {
    type: 'swap',
    onClick: (() => null),
  },
];

const Actions = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        ACTIONS.map((action) => (
          <ActionButton type={action.type} onClick={action.onClick} />
        ))
      }
    </div>
  );
};

export default Actions;
