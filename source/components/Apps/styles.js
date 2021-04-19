import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
  },
}));
