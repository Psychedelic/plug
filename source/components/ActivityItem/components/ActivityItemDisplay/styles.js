import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: theme.spacing(1),
  },
  tooltip: {
    margin: '8px 0',
  },
}));
