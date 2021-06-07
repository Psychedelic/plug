import React from 'react';
import PropTypes from 'prop-types';
import ConnectionStatus from '../ConnectionStatus';
import NavBar from '../NavBar';
import useStyles from './styles';

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <ConnectionStatus status="plugged" web="fleek.ooo" />
      <NavBar />
      <div className={classes.root}>
        {children}
      </div>
    </>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
