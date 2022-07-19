import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import YellowWarning from '@assets/icons/yellow-warning.svg';

import useStyles from './styles';

const DataDisplay = ({ value, big, warn }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, big && classes.big)}>
      <span className={classes.text}>{value}</span>
      {warn && (
        <img
          src={YellowWarning}
          className={classes.yellowWarningIcon}
          alt="warning-icon"
        />
      )}
    </div>
  );
};

export default DataDisplay;

DataDisplay.defaultProps = {
  big: false,
  warn: false,
};

DataDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  big: PropTypes.bool,
  warn: PropTypes.bool,
};
