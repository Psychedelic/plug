import React from 'react';
import { PropTypes } from 'prop-types';
import { capitalize, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Trash2 } from 'react-feather';

import { setUseICNS } from '@redux/icns';
import { useICPPrice } from '@redux/icp';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { setCurrentNetwork, removeNetwork } from '@redux/network';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

import useStyles from './styles';

const NetworkCard = ({
  name, ledgerCanisterId, host, id,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const icpPrice = useICPPrice();

  const selectNetwork = () => {
    dispatch(setCurrentNetwork(id));
    dispatch(setUseICNS(false));
    dispatch(setAssetsLoading(true));
    sendMessage({
      type: HANDLER_TYPES.GET_ASSETS,
      params: { refresh: true },
    }, (keyringAssets) => {
      dispatch(setAssets({ keyringAssets, icpPrice }));
      dispatch(setAssetsLoading(false));
    });
  };

  const handleRemoveNetwork = () => {
    dispatch(removeNetwork(id));
  };

  const isMainnet = id === 'mainnet';
  return (
    <div onClick={selectNetwork} className={classes.networkCard} data-testid={`network-card-${name}`}>
      <div className={classes.networkData}>
        <Typography variant="h4">{capitalize(name)}</Typography>
        <Typography variant="subtitle2">{host}</Typography>
        <Typography variant="subtitle2">{ledgerCanisterId}</Typography>
      </div>
      {!isMainnet && (
        <Trash2
          className={classes.removeIcon}
          onClick={handleRemoveNetwork}
          size="18"
          data-testid={`delete-network-button-${name}`}
        />
      )}
    </div>
  );
};

NetworkCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  ledgerCanisterId: PropTypes.string.isRequired,
};

export default NetworkCard;
