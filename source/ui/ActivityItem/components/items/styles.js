import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles(() => ({
  image: {
    height: 41,
    width: 41,
    boxShadow: SHADOW_1,
    borderRadius: 10,
  },
  pluggedTitle: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 331,
  },
}));
