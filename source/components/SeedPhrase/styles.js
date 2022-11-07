import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';
import RAINBOW_GRADIENT from '@shared/styles/gradients';

const RAINBOW_GRADIENT_BG = 'linear-gradient(96.51deg, rgba(255, 231, 1, 0.8) 8.72%, rgba(255, 0, 196, 0.8) 38.27%, rgba(0, 232, 255, 0.8) 68.28%, rgba(0, 255, 1, 0.8) 94.7%)';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  seedContainer: {
    background: theme.palette.common.white,
    boxShadow: SHADOW_1,
    borderRadius: 10,
    padding: 2,
    cursor: 'pointer',
    maxWidth: 550,
    width: '100%',
    height: 185,
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
  blurContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  blur: {
    height: '100%',
    width: '100%',
    margin: 12,
    inset: 0,
    zIndex: 2,
    backdropFilter: 'blur(7px)',
    borderRadius: 10,
  },
  rainbowBg: {
    width: '100%',
    height: '80%',
    maxWidth: 350,
    background: RAINBOW_GRADIENT_BG,
    filter: 'blur(25px)',
    borderRadius: 300,
  },
}));
