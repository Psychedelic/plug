import React from 'react';
import Plug from '../Plug';
import Profile from '../Profile';
import WalletInfo from '../WalletInfo';
import useStyles from './styles';

const NavBar = () => {
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
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
