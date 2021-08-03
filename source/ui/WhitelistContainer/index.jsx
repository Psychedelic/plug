import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const WhitelistContainer = ({ children, ...other }) => {
  const classes = useStyles();

  return (
    <div className={classes.whitelistContainer} {...other}>
      {children}
    </div>
  );
};

export default WhitelistContainer;

WhitelistContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
