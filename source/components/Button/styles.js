import { makeStyles } from '@material-ui/core/styles';

import RAINBOW_GRADIENT from '@shared/styles/gradients';
import SHADOW_1 from '@shared/styles/shadows';

const defaultBoxShadow = '0px 1px 2px rgba(0, 0, 0, 0.05)';

export default makeStyles((theme) => ({
  root: {
    minWidth: 130,
    fontSize: 16,
    lineHeight: '16px',
    borderRadius: '10px',
    textTransform: 'none',
    transition: 'transform 0.3s',
    height: 42,
    '&:hover, &:active': {
      transform: 'scale(1.03)',
    },
  },
  primary: {
    fontWeight: 700,
    color: 'white',
    background: theme.palette.primary.main,
    boxShadow: SHADOW_1,
    '&:hover': {
      opacity: 0.9,
      boxShadow: SHADOW_1,
      background: theme.palette.primary.main,
    },
    '&:disabled': {
      opacity: 0.6,
      color: 'white',
      boxShadow: SHADOW_1,
      background: theme.palette.primary.main,
    },
  },
  rainbow: {
    fontWeight: 700,
    color: 'white',
    background: theme.palette.primary.mainGradient,
    boxShadow: SHADOW_1,
    '&:hover': {
      opacity: 0.9,
      boxShadow: SHADOW_1,
    },
    '&:disabled': {
      opacity: 0.6,
      color: 'white',
      boxShadow: SHADOW_1,
    },
  },
  danger: {
    fontWeight: 700,
    color: 'white',
    background: theme.palette.danger.main,
    boxShadow: SHADOW_1,

    '&:hover': {
      opacity: 0.9,
      background: theme.palette.danger.main,
      boxShadow: SHADOW_1,
    },
    '&:disabled': {
      opacity: 0.6,
      color: 'white',
      background: theme.palette.danger.main,
      boxShadow: SHADOW_1,
    },
  },
  default: {
    fontWeight: 500,
    color: '#374151',
    border: '1px solid #D1D5DB',
    boxShadow: defaultBoxShadow,
    '&:hover': {
      opacity: 0.9,
      boxShadow: defaultBoxShadow,
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: defaultBoxShadow,
    },
  },
  primaryOutlined: {
    padding: '4px 12px',
    minWidth: 'auto',
    height: 'auto',
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    color: '#3775F4',
    border: '1px solid #3775F4',
    boxShadow: 'none',
    '&:hover': {
      opacity: 0.9,
      boxShadow: 'none',
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: 'none',
    },
  },
  rainbowOutlined: {
    color: '#111827',
    border: 'double 2px transparent',
    backgroundImage: RAINBOW_GRADIENT,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: 'none',
    '&:hover': {
      opacity: 0.9,
      boxShadow: 'none',
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: 'none',
    },
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  fullWidth: {
    width: '100%',
  },
  blue: {
    color: 'white',
    border: 'none',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
    background: '#3574F4',
    fontWeight: 'bold',
    '&:hover': {
      opacity: 0.9,
      boxShadow: 'none',
      background: '#3574F4',
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: 'none',
    },
  },
}));
