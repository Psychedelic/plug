import { makeStyles } from '@material-ui/core/styles';

import SHADOW_1 from '@shared/styles/shadows';
import RAINBOW_GRADIENT from '@shared/styles/gradients';

export default makeStyles((theme) => ({
  leftContainer: {
    padding: '12px 16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,

    '&:hover': {
      background: '#F3F4F6',
    },
  },
  swapIcon: {
    position: 'absolute',
    right: 6,
    bottom: 0,
    top: 0,
    height: 30,
    margin: 'auto',
    width: 30,
  },
  icon: {
    height: 29,
    width: 29,
    marginRight: theme.spacing(1),
    borderRadius: 26,
    boxShadow: SHADOW_1,
  },
  alignRight: {
    marginLeft: theme.spacing(1),
  },
  rightContainer: {
    display: 'inline-flex',
    width: '100%',
    position: 'relative',
  },
  estimatedTotal: {
    pointerEvents: 'none',
    position: 'absolute',
    bottom: 8,
    left: 12,
    margin: 'auto',
    height: 'fit-content',
    right: theme.spacing(1),
    color: theme.palette.common.gray,
    fontSize: 12,
  },
  input: {
    width: '100%',

    '& .MuiInputBase-input': {
      fontWeight: 600,
      fontSize: 18,
      zIndex: 1,
      padding: 12,
    },
    '& .MuiInputBase-root': {
      height: '100%',
      alignItems: 'flex-start',
      zIndex: 0,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
        borderLeft: '1px solid #D1D5DB',
        margin: -1,
        borderRadius: 0,
      },
      '&:hover fieldset': {
        margin: -1,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        border: 'double 1px transparent',
        backgroundImage:
          RAINBOW_GRADIENT,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      },
      '&.Mui-focused fieldset': {
        margin: -1,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        border: 'double 2px transparent',
        backgroundImage:
          RAINBOW_GRADIENT,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      },
    },
  },
}));
