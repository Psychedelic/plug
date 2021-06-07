import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    alignItems: 'center',
  },
  icon: {
    marginLeft: 'auto',
  },
  title: {
    marginLeft: theme.spacing(1),
  },
}));
