import React, { useState, forwardRef } from 'react';
import InputBase from '@material-ui/core/InputBase';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const TextInput = forwardRef(({
  value, type, onChange, startIcon, error, disabled, ...other
}, ref) => {
  const classes = useStyles();

  const [isFocus, setIsFocus] = useState(false);

  console.log(ref);

  return (
    <InputBase
      ref={ref}
      classes={{
        root: clsx(classes.root,
          !disabled && classes.hover,
          (isFocus && !error) && classes.focus,
          error && classes.error),
      }}
      value={value}
      type={type}
      onChange={onChange}
      startAdornment={startIcon}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      disabled={disabled}
      {...other}
    >
      <img />
    </InputBase>
  );
});

export default TextInput;

TextInput.displayName = 'TextInput';

TextInput.defaultProps = {
  error: false,
  startIcon: null,
  disabled: false,
};

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  startIcon: PropTypes.node,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
};
