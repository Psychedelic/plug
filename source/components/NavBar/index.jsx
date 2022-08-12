import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import clsx from 'clsx';
import { useRouter } from '../Router';
import Plug from '../Plug';
import Profile from '../Profile';
import WalletInfo from '../WalletInfo';
import useStyles from './styles';

const NavBar = ({ disableProfile, disableNavigation }) => {
  const { navigator } = disableNavigation ? {} : useRouter();
  const classes = useStyles();
  const navigateHome = () => navigator?.navigate('home');
  return (
    <div className={classes.root}>
      <Button aria-label="Plug" className={clsx(classes.flex, classes.logoButton)} onClick={navigateHome}>
        <Plug size="small" />
      </Button>
      <div className={classes.walletContainer}>
        <WalletInfo />
      </div>
      <div className={classes.flex}>
        <Profile disableProfile={disableProfile} />
      </div>
    </div>
  );
};

NavBar.propTypes = {
  disableProfile: PropTypes.bool.isRequired,
  disableNavigation: PropTypes.bool,
};

NavBar.defaultProps = {
  disableNavigation: false,
};

export default NavBar;
