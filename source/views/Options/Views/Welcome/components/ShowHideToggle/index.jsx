import React from 'react';
import PropTypes from 'prop-types';

import { Eye, EyeOff } from 'react-feather';

import useStyles from './styles';

const ShowHideToggle = ({
  show, label, name, onChange, disabled, size,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.showHideToggleContainer}>
      <input
        className={classes.showHideToggleInput}
        id={name}
        type="checkbox"
        checked={show}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={name} className={classes.showHideToggleLabel} title={label}>
        {show ? <Eye size={size} color="grey" /> : <EyeOff size={size} color="grey" />}
      </label>
    </div>
  );
};

ShowHideToggle.propTypes = {
  show: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  size: PropTypes.number,
};

ShowHideToggle.defaultProps = {
  size: 17,
};

export default ShowHideToggle;
