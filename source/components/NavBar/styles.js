import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles({
  root: {
    height: 68,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 10,
    position: 'relative',
    background: '#FFFFFF',
    boxShadow: SHADOW_1,
  },
  logoButton: {
    height: 68,
    borderRadius: 0,
  },
  walletContainer: {
    flex: 3,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
