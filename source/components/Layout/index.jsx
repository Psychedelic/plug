import React from 'react';
import PropTypes from 'prop-types';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import ConnectionStatus from '../ConnectionStatus';
import NavBar from '../NavBar';
import useStyles from './styles';

const Layout = ({ children, disableProfile, incStatus }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.stickyHeader}>
        <ConnectionStatus incStatus={incStatus ? CONNECTION_STATUS.pending : null} />
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
  incStatus: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  disableProfile: PropTypes.bool,
  incStatus: PropTypes.bool,
};
