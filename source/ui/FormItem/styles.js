import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  label: {
    fontWeight: 700,
  },
  componentContainer: {
    marginTop: theme.spacing(1),
  },
  subtitleContainer: {
    marginTop: theme.spacing(0.5),
  },
}));
