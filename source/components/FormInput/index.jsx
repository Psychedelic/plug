import React, { forwardRef } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import useStyles from './styles';

const FormInput = forwardRef(({
  id, label, fullWidth, containerClassName, ...props
}, ref) => {
  const classes = useStyles();

  return (
    <FormControl fullWidth={fullWidth} className={containerClassName}>
      <InputLabel shrink htmlFor={id} className={classes.formLabel}>
        <Typography variant="h6">{label}</Typography>
      </InputLabel>
      <TextInput ref={ref} id={id} {...props} />
    </FormControl>
  );
});

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  fullWidth: PropTypes.bool,
  containerClassName: PropTypes.string,
};

FormInput.defaultProps = {
  fullWidth: true,
  containerClassName: '',
};

export default FormInput;
