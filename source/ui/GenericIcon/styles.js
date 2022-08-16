import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles({
  root: {
    height: 41,
    width: 41,
    boxShadow: SHADOW_1,
    borderRadius: 26,
    position: 'relative',
  },
  activity: {
    position: 'absolute',
    right: -20,
    top: -20,
    borderRadius: 26,
    zIndex: 1,
  },
});
