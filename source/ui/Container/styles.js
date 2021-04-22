import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  small: {
    padding: `0px ${theme.spacing(2)}px ${theme.spacing(2.5)}px`,
  },
  big: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      4,
    )}px`,
  },
}));
