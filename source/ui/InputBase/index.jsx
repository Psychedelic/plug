import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import useStyles from './styles';

const InputBase = ({ children, className }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, className)}>
      {children}
    </div>
  );
};

export default InputBase;

InputBase.defaultProps = {
  className: '',
};

InputBase.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
