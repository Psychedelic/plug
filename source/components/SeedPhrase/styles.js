import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@styles/shadows';
import RAINBOW_GRADIENT from '@styles/gradients';

export default makeStyles((theme) => ({
  root: {
    background: theme.palette.common.white,
    boxShadow: SHADOW_1,
    borderRadius: 10,
    padding: 2,
    position: 'relative',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      padding: 0,
      border: 'double 2px transparent',
      backgroundImage: RAINBOW_GRADIENT,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
  item: {
    flex: '1 1 30%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    margin: '8px 0',
  },
}));
