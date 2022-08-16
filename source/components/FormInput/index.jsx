import React, { forwardRef } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import useStyles from './styles';

const FormInput = forwardRef(({ id, label, ...props }, ref) => {
  const classes = useStyles();

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={id} className={classes.formLabel}>
        <Typography variant="h6">{label}</Typography>
      </InputLabel>
      <TextInput ref={ref} id={id} {...props} />
    </FormControl>
  );
});

export default FormInput;

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
};
