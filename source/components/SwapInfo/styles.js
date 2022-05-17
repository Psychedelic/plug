import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  assetInfo: {
    width: 170,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  arrows: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.spacing(3),
    margin: 'auto',
  },
  icon: {
    height: 41,
    width: 41,
    borderRadius: 26,
    boxShadow: SHADOW_1,
    marginBottom: theme.spacing(0.75),
  },
  asset: {
    fontSize: 18,
    marginBottom: theme.spacing(0.1),
  },
}));
