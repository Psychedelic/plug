import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  plugContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 377,
  },
  title: {
    marginBottom: theme.spacing(0.5),
  },
  textContainer: {
    textAlign: 'center',
  },
  cyclesContainer: {
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  command: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.2),
  },
}));
