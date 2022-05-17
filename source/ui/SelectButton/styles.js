import { makeStyles } from '@material-ui/core/styles';

import SHADOW_1 from '@shared/styles/shadows';
import RAINBOW_GRADIENT from '@shared/styles/gradients';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 65,
    background: 'white',
    borderRadius: 10,
    border: '1px solid #D1D5DB',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    padding: '12px 16px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    transition: 'background 0.2s',

    '&:hover': {
      padding: '11px 16px',
      border: 'double 1px transparent',
      backgroundImage: RAINBOW_GRADIENT,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
  selected: {
    padding: '10px 15px',
    border: 'double 2px transparent',
    backgroundImage: RAINBOW_GRADIENT,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  },
  iconLeft: {
    height: 38,
    width: 38,
    marginRight: theme.spacing(1),
    borderRadius: 38,
    boxShadow: SHADOW_1,
  },
  iconRight: {
    height: 18,
    width: 18,
    marginLeft: 'auto',
  },
}));
