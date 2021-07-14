import React from 'react';
import PropTypes from 'prop-types';
import ConnectionStatus from '../ConnectionStatus';
import NavBar from '../NavBar';
import useStyles from './styles';

const Layout = ({ children, disableProfile }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.stickyHeader}>
        <ConnectionStatus status="plugged" web="fleek.ooo" />
        <NavBar disableProfile={disableProfile} />
      </div>
      <div className={classes.root}>
        {children}
      </div>
    </>
  );
};

export default Layout;

Layout.defaultProps = {
  disableProfile: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  disableProfile: PropTypes.bool,
};
