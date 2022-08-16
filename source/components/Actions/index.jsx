import React from 'react';
import { useRouter } from '@components/Router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';
import useStyles from './styles';

const ACTIONS = ['deposit', 'send', 'swap'];

const Actions = ({ visible }) => {
  const classes = useStyles();
  const { navigator } = useRouter();

  // TODO: Re-enable swap when available.
  const navigate = (route) => () => route !== 'swap' && navigator.navigate(route);

  return (
    <div className={clsx(classes.root, visible ? classes.visible : classes.invisible)}>
      {
        ACTIONS.map((action) => (
          <ActionButton key={action} type={action} onClick={navigate(action)} buttonTestId={`open-${action}-view-button`} />
        ))
      }
    </div>
  );
};

export default Actions;

Actions.propTypes = {
  visible: PropTypes.bool.isRequired,
};
