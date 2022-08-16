import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const HoverAnimation = ({ children, disabled, style }) => {
  const classes = useStyles();

  return (
    <div className={disabled ? '' : classes.hoverAnimation} style={style}>
      {children}
    </div>
  );
};

export default HoverAnimation;

HoverAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.string),
};

HoverAnimation.defaultProps = {
  disabled: false,
  style: {},
};
