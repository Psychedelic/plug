import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@assets/icons/plug.svg';
import Triangle from '@assets/icons/triangle.svg';
import useStyles from './styles';

const Plug = ({ size, message, ...other }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img
        src={Icon}
        alt="Yung Plug"
        className={classes[size]}
        {...other}
      />
      {
        message
        && (
        <>
          <img src={Triangle} className={classes.triangle} />
          <div className={classes.globe}>
            {message}
          </div>
        </>
        )
      }
    </div>
  );
};

export default Plug;

Plug.defaultProps = {
  message: null,
};

Plug.propTypes = {
  size: PropTypes.oneOf(['small', 'big']).isRequired,
  message: PropTypes.string,
};
