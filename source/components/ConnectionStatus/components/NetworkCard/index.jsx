import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';

import BlueCheck from '@assets/icons/blue-check.svg';
import { setCurrentNetwork } from '@redux/network';

import useStyles from './styles';

const NetworkCard = ({ network, withDivider }) => {
  const classes = useStyles();
  const { currentNetwork } = useSelector((state) => state.network);
  const dispatch = useDispatch();
  const selectNetwork = (id) => () => {
    dispatch(setCurrentNetwork(id));
  };

  const active = (currentNetwork?.id || null) === network.id;
  return (
    <>
      <div
        className={clsx(classes.network, active && classes.activeNetwork)}
        onClick={selectNetwork(network.id)}
      >
        <div className={classes.networkId}>
          <div className={clsx(
            classes.statusDot,
            active && classes.activeDot,
          )}
          />
          <Typography variant="h5">{network.name}</Typography>
        </div>
        {active && (
          <img src={BlueCheck} alt="Selected Network" className={classes.check} />
        )}
      </div>
      {withDivider && <div className={classes.divider} />}
    </>
  );
};

NetworkCard.propTypes = {
  network: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  withDivider: PropTypes.bool.isRequired,
};

export default NetworkCard;
