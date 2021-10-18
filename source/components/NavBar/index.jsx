import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { useRouter } from '@components';
import Plug from '../Plug';
import Profile from '../Profile';
import WalletInfo from '../WalletInfo';
import useStyles from './styles';

const NavBar = ({ disableProfile }) => {
  const { navigator } = useRouter();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button aria-label="Plug" className={classes.flex} onClick={() => navigator.navigate('home')}>
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

export default NavBar;

NavBar.propTypes = {
  disableProfile: PropTypes.bool.isRequired,
};
