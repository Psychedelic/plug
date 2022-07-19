import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const CanisterInfoContainer = forwardRef(({ className, ...props }, ref) => {
  const classes = useStyles();

  return <div ref={ref} className={clsx(classes.canisterInfoContainer, className)} {...props} />;
});

export default CanisterInfoContainer;

CanisterInfoContainer.displayName = 'CanisterInfoContainer';

CanisterInfoContainer.defaultProps = {
  className: '',
};

CanisterInfoContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
