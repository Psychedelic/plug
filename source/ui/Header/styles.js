import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    display: 'flex',
  },
  left: {
    marginRight: 'auto',
    display: 'flex',
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
  },
}));
