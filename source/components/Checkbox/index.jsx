import React from 'react';
import PropTypes from 'prop-types';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './styles';

const Checkbox = ({
  checked, handleChange, label, className, ...other
}) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={clsx(classes.formLabel, className)}
      control={(
        <MuiCheckbox
          className={classes.root}
          checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
          icon={<span className={classes.icon} />}
          checked={checked}
          onChange={handleChange}
          color="primary"
          {...other}
        />
      )}
      label={<Typography variant="h6">{label}</Typography>}
      {...other}
    />
  );
};

export default Checkbox;

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  className: '',
};
