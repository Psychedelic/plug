import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Container = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default Container;

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
