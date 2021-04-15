import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const HoverAnimation = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.hoverAnimation}>
      {children}
    </div>
  );
};

export default HoverAnimation;

HoverAnimation.propTypes = {
  children: PropTypes.node.isRequired,
};
