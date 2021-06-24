import React from 'react';
import { useRouter } from '@components/Router';
import { ActionButton } from '@ui';
import useStyles from './styles';

const ACTIONS = ['deposit', 'send', 'swap'];

const Actions = () => {
  const classes = useStyles();
  const { navigator } = useRouter();

  // TODO: Re-enable swap when available.
  const navigate = (route) => () => route !== 'swap' && navigator.navigate(route);
  return (
    <div className={classes.root}>
      {
        ACTIONS.map((action) => (
          <ActionButton key={action} type={action} onClick={navigate(action)} />
        ))
      }
    </div>
  );
};

export default Actions;
