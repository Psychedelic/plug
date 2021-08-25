import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Badge = ({ name, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        name
        && <span className={classes.name}>{name}</span>
      }
      <span className={classes.value}>{value}</span>
    </div>
  );
};

export default Badge;

Badge.defaultProps = {
  name: null,
};

Badge.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
};
