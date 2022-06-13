import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { Checkbox } from '@ui';
import { Typography } from '@material-ui/core';
import shortAddress from '@shared/utils/short-address';

import useStyles from './styles';
import UserIcon from '../../../UserIcon';

const ConnectAccountItem = ({
  connected, wallet, checked, onCheck, name,
}) => {
  const classes = useStyles();
  return (
    <div
      key={wallet.walletNumber}
      className={clsx(
        classes.flex,
        classes.walletContainer,
        connected && classes.walletConnected,
      )}
    >
      <div className={classes.flex}>
        <Checkbox
          className={classes.checkbox}
          checked={checked}
          handleChange={!connected && onCheck(wallet.walletNumber)}
        />
        <UserIcon size="small" icon={wallet.icon} style={{ marginLeft: -6, marginRight: 12 }} />
        <Typography variant="h6" className={classes.walletName}>{name || ''}</Typography>
      </div>
      <Typography variant="h6">{shortAddress(wallet.principal)}</Typography>
    </div>
  );
};

ConnectAccountItem.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.string).isRequired,
  connected: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default ConnectAccountItem;
