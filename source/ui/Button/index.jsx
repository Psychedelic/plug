import MuiButton from '@material-ui/core/Button';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useStyles from './styles';

const VARIANTS = {
  rainbow: {
    variant: 'contained',
  },
  danger: {
    variant: 'contained',
  },
  default: {
    variant: 'outlined',
  },
};

const Button = ({
  value, onClick, variant, ...other
}) => {
  const classes = useStyles();

  return (
    <MuiButton
      onClick={onClick}
      className={clsx(classes.root, classes[variant])}
      {...VARIANTS[variant]}
      {...other}
    >
      {value}
    </MuiButton>
  );
};

export default Button;

Button.propTypes = {
  value: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['rainbow', 'danger', 'default']).isRequired,
  onClick: PropTypes.func.isRequired,
};
