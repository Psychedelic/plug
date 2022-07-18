import React from 'react';
import MuiButton from '@material-ui/core/Button';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './styles';

const VARIANTS = {
  rainbow: {
    variant: 'contained',
  },
  rainbowOutlined: {
    variant: 'outlined',
  },
  danger: {
    variant: 'contained',
  },
  default: {
    variant: 'outlined',
  },
  primary: {
    variant: 'contained',
  },
  primaryOutlined: {
    variant: 'outlined',
  },
};

const Button = ({
  value, onClick, variant, loading, disabled, fullWidth, wrapperStyle, buttonTestId, ...other
}) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.wrapper, fullWidth && classes.fullWidth)}
      style={{ ...wrapperStyle }}
    >
      <MuiButton
        onClick={onClick}
        className={clsx(classes.root, classes[variant])}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        {...VARIANTS[variant]}
        data-testid={buttonTestId}
        {...other}
      >
        {
          !loading
          && value
        }
      </MuiButton>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

export default Button;

Button.defaultProps = {
  loading: false,
  disabled: false,
  fullWidth: false,
  wrapperStyle: null,
  buttonTestId: 'button',
};

Button.propTypes = {
  value: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['rainbow', 'danger', 'default', 'primary', 'primaryOutlined', 'rainbowOutlined']).isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  buttonTestId: PropTypes.string,
};
