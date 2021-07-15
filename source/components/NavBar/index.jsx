import React from 'react';
import PropTypes from 'prop-types';
import Plug from '../Plug';
import Profile from '../Profile';
import WalletInfo from '../WalletInfo';
import useStyles from './styles';

const NavBar = ({ disableProfile }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.flex}>
        <Plug size="small" />
      </div>
      <div className={classes.walletContainer}>
        <WalletInfo />
      </div>
      <div className={classes.flex}>
        <Profile disableProfile={disableProfile} />
      </div>
    </div>
  );
};

export default NavBar;

NavBar.propTypes = {
  disableProfile: PropTypes.bool.isRequired,
};
