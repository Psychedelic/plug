import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const HoverAnimation = ({ children, disabled }) => {
  const classes = useStyles();

  return (
    <div className={disabled ? '' : classes.hoverAnimation}>
      {children}
    </div>
  );
};

export default HoverAnimation;

HoverAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

HoverAnimation.defaultProps = {
  disabled: false,
};
