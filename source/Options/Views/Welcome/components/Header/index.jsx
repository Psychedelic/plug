import React from 'react';
import PropTypes from 'prop-types';
import { Plug } from '@components';
import { Typography } from '@material-ui/core';
import useStyles from './styles';

const Header = ({ title, subtitle, message }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Plug size="big" message={message} style={{ marginBottom: 6 }} />
      <Typography variant="h2">{title}</Typography>
      <Typography variant="subtitle1" className={classes.subtitle}>{subtitle}</Typography>
    </div>
  );
};

export default Header;

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
