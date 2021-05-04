import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useStyles from './styles';

const DataDisplay = ({ value, big }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, big && classes.big)}>
      <span className={classes.text}>{value}</span>
    </div>
  );
};

export default DataDisplay;

DataDisplay.defaultProps = {
  big: false,
};

DataDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  big: PropTypes.bool,
};
