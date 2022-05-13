import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles((theme) => ({
  root: {
    background: theme.palette.common.white,
    boxShadow: SHADOW_1,
    borderRadius: 20,
    padding: theme.spacing(1),
    width: 'fit-content',
    display: 'flex',
    height: 'fit-content',
    margin: 'auto',
  },
}));
