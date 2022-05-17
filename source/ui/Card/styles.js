import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles({
  root: {
    width: '100%',
    boxShadow: SHADOW_1,
    borderRadius: 10,
    padding: '0 15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});
