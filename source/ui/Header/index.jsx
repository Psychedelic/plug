import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Header = ({
  center,
  left,
  right,
  ...other
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        left
        && <div className={classes.left}>{left}</div>
      }
      <Typography variant="h3" {...other} className={classes.center}>{center}</Typography>
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
  center: PropTypes.string.isRequired,
  left: PropTypes.node,
  right: PropTypes.node,
};
