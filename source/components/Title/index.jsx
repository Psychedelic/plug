import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Title = ({ icon, value, iconClassName }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        icon
        && <img src={icon} className={`${classes.icon} ${iconClassName}`} />
      }
      <Typography variant="h3">{value}</Typography>
    </div>
  );
};

export default Title;

Title.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.string.isRequired,
  iconClassName: PropTypes.string,
};

Title.defaultProps = {
  icon: null,
  iconClassName: '',
};
