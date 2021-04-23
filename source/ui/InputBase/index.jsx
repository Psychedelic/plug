import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const InputBase = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default InputBase;

InputBase.propTypes = {
  children: PropTypes.node.isRequired,
};
