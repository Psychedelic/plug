import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    width: '100%',
  },
  label: {
    fontWeight: 700,
    textAlign: 'left',
  },
  componentContainer: {
    marginTop: theme.spacing(0.5),
  },
  subtitleContainer: {
    marginTop: theme.spacing(0.5),
  },
}));
