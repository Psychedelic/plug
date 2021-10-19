import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { useRouter } from '@components';
import Plug from '../Plug';
import Profile from '../Profile';
import WalletInfo from '../WalletInfo';
import useStyles from './styles';

const NavBar = ({ disableProfile, disableNavigation }) => {
  const navigator = disableNavigation ? null : useRouter();
  const classes = useStyles();
  const navigateHome = () => navigator ?? navigator.navigate('home');
  return (
    <div className={classes.root}>
      <Button aria-label="Plug" className={classes.flex} onClick={navigateHome}>
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
  disableNavigation: PropTypes.string,
};

NavBar.defaultProps = {
  disableNavigation: false,
};

export default NavBar;
