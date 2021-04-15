import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@assets/icons/plug.svg';
import useStyles from './styles';

const Plug = ({ size }) => {
  const classes = useStyles();
  return (
    <img
      src={Icon}
      alt="Yung Plug"
      className={classes[size]}
    />
  );
};

export default Plug;

Plug.propTypes = {
  size: PropTypes.oneOf(['small', 'big']).isRequired,
};
