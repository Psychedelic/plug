import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    height: 350,
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  image: {
    width: 46,
    height: 46,
    marginBottom: 20,
  },
  text: {
    marginBottom: 20,
  },
  button: {
    width: 165,
  },
}));
