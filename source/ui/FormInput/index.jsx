import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import useStyles from './styles';

const FormInput = ({
  id, label, type, value, onChange,
}) => {
  const classes = useStyles();

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={id} className={classes.formLabel}>
        <Typography variant="h6">{label}</Typography>
      </InputLabel>
      <TextInput id={id} type={type} value={value} onChange={onChange} />
    </FormControl>
  );
};

export default FormInput;

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
