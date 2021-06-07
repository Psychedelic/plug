import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2.75)}px ${theme.spacing(2)}px`,
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
