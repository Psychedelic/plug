import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const Container = ({ children, big, ...other }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, big ? classes.big : classes.small)} {...other}>
      {children}
    </div>
  );
};

export default Container;

Container.defaultProps = {
  big: false,
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  big: PropTypes.bool,
};
