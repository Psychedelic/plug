import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: 300,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: `${theme.spacing(2.5)}px 0 ${theme.spacing(1.5)}px`,
  },
}));
