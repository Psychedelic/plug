import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DepositIcon from '@material-ui/icons/AddRounded';
import SendIcon from '@material-ui/icons/Telegram';
import SwapIcon from '@material-ui/icons/SwapHorizRounded';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useStyles from './styles';
import HoverAnimation from '../HoverAnimation';

const ACTION_SETTINGS = {
  deposit: {
    name: 'Deposit',
    icon: <DepositIcon style={{ fontSize: '1.3em' }} />,
    iconClass: 'iconDeposit',
    textClass: 'textDeposit',
  },
  send: {
    name: 'Send',
    icon: <SendIcon style={{ fontSize: '1.3em' }} />,
    iconClass: 'iconSend',
    textClass: 'textSend',
  },
  swap: {
    name: 'Swap',
    icon: <SwapIcon style={{ fontSize: '1.3em' }} />,
    iconClass: 'iconSwap',
    textClass: 'textSwap',
  },
};

const ActionButton = ({ type, onClick }) => {
  const {
    name,
    icon,
    iconClass,
    textClass,
  } = ACTION_SETTINGS[type];

  const classes = useStyles();

  return (
    <HoverAnimation>
      <div className={classes.root} onClick={onClick}>
        <IconButton className={clsx(classes.icon, classes[iconClass])}>
          {icon}
        </IconButton>
        <span className={clsx(classes.text, classes[textClass])}>
          {name}
        </span>
      </div>
    </HoverAnimation>
  );
};

export default ActionButton;

ActionButton.propTypes = {
  type: PropTypes.oneOf(['deposit', 'send', 'swap']).isRequired,
  onClick: PropTypes.func.isRequired,
};
