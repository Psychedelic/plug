import React from 'react';
import { useRouter } from '@components/Router';
import { ActionButton } from '@ui';
import useStyles from './styles';

const ACTIONS = (navigator) => [
  {
    type: 'deposit',
    onClick: (() => navigator.navigate('deposit')),
  },
  {
    type: 'send',
    onClick: (() => navigator.navigate('send')),
  },
  {
    type: 'swap',
    onClick: (() => navigator.navigate('swap')),
  },
];

const Actions = () => {
  const classes = useStyles();
  const { navigator } = useRouter();

  return (
    <div className={classes.root}>
      {
        ACTIONS(navigator).map((action) => (
          <ActionButton key={action.type} type={action.type} onClick={action.onClick} />
        ))
      }
    </div>
  );
};

export default Actions;
