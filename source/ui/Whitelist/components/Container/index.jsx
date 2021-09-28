import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const WhitelistContainer = forwardRef(({ className, ...props }, ref) => {
  const classes = useStyles();

  return <div ref={ref} className={clsx(classes.whitelistContainer, className)} {...props} />;
});

export default WhitelistContainer;

WhitelistContainer.displayName = 'WhitelistContainer';

WhitelistContainer.defaultProps = {
  className: undefined,
};

WhitelistContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
