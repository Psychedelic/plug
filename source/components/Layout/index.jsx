import React from 'react';
import PropTypes from 'prop-types';
import ConnectionStatus from '../ConnectionStatus';
import NavBar from '../NavBar';

const Layout = ({ children }) => (
  <>
    <ConnectionStatus status="plugged" web="fleek.ooo" />
    <NavBar />
    <div>
      {children}
    </div>
  </>
);

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
