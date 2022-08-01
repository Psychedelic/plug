import React from 'react';
import PropTypes from 'prop-types';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import ConnectionStatus from '../ConnectionStatus';
import NavBar from '../NavBar';
import useStyles from './styles';

const Layout = ({
  children, disableProfile, incStatus, disableNavigation,
}) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.stickyHeader}>
        <ConnectionStatus
          incStatus={incStatus ? CONNECTION_STATUS.pending : null}
          disableNavigation={disableNavigation}
          // TODO: remove this once we hook up provider to custom networks
          hideNetwork={disableProfile && disableNavigation}
        />
        <NavBar disableProfile={disableProfile} disableNavigation={disableNavigation} />
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
  disableNavigation: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  disableProfile: PropTypes.bool,
  disableNavigation: PropTypes.bool,
  incStatus: PropTypes.bool,
};
