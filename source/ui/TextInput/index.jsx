import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import PropTypes from 'prop-types';
import useStyles from './styles';

const TextInput = ({
  value, type, onChange, ...other
}) => {
  const classes = useStyles();

  return (
    <InputBase
      classes={{
        root: classes.root,
        input: classes.input,
      }}
      value={value}
      type={type}
      onChange={onChange}
      {...other}
    />
  );
};

export default TextInput;

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
