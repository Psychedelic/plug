import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: theme.spacing(5),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
  },
  left: {
    marginRight: 'auto',
  },
  right: {
    marginLeft: 'auto',
  },
}));
