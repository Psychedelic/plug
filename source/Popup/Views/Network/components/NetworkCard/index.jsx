import React from 'react';
import { PropTypes } from 'prop-types';
import { capitalize, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Trash2 } from 'react-feather';

import { setCurrentNetwork, removeNetwork } from '@redux/network';

import useStyles from './styles';

const NetworkCard = ({
  name, ledgerId, host, id,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const selectNetwork = () => {
    dispatch(setCurrentNetwork(id));
  };

  const handleRemoveNetwork = () => {
    dispatch(removeNetwork(id));
  };

  const isMainnet = id === 'mainnet';
  return (
    <div onClick={selectNetwork} className={classes.networkCard}>
      <div className={classes.networkData}>
        <Typography variant="h4">{capitalize(name)}</Typography>
        <Typography variant="subtitle2">{host}</Typography>
        <Typography variant="subtitle2">{ledgerId}</Typography>
      </div>
      {!isMainnet && (
        <Trash2
          className={classes.removeIcon}
          onClick={handleRemoveNetwork}
          size="18"
        />
      )}
    </div>
  );
};

NetworkCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  ledgerId: PropTypes.string.isRequired,
};

export default NetworkCard;
