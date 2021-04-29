import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    height: 'fit-content',
    right: theme.spacing(1),
    top: 0,
    bottom: 0,
    display: 'flex',
    margin: 'auto',
  },
  icon: {
    width: 21,
    height: 21,
  },
  spinner: {
    color: '#6B7280',
  },
}));
