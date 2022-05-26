import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: 41,
    width: 41,
    cursor: 'pointer',
  },
  image: {
    height: 24,
    width: 24,
    borderRadius: 26,
    position: 'absolute',
    boxShadow: SHADOW_1,
  },
  fromImage: {
    top: -3,
    left: -3,
  },
  toImage: {
    right: -3,
    bottom: -3,
  },
  swapImage: {
    position: 'absolute',
    left: 7,
    bottom: 5,
  },
  hovered: {
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
}));
