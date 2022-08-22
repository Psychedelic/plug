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
    height: 28,
    width: 28,
    borderRadius: '50%',
    position: 'absolute',
    boxShadow: SHADOW_1,
  },
  fromImage: {
    top: -2,
    left: 0,
  },
  toImage: {
    right: 0,
    bottom: 0,
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
