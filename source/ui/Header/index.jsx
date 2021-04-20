import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Header = ({ value, left, right }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        left
        && <div className={classes.left}>{left}</div>
      }
      <Typography variant="h3" className={classes.center}>{value}</Typography>
      {
        right
        && <div className={classes.right}>{right}</div>
      }
    </div>
  );
};

export default Header;

Header.defaultProps = {
  left: null,
  right: null,
};

Header.propTypes = {
  value: PropTypes.string.isRequired,
  left: PropTypes.node,
  right: PropTypes.node,
};
