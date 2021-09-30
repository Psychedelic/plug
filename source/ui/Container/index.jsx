import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const Container = ({
  children, big, className, ...other
}) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, big ? classes.big : classes.small, className)} {...other}>
      {children}
    </div>
  );
};

export default Container;

Container.defaultProps = {
  big: false,
  className: '',
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  big: PropTypes.bool,
  className: PropTypes.string,
};
