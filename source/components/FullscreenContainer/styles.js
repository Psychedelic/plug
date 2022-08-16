import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    padding: `${theme.spacing(4)}px 0`,
    position: 'relative',
    background:
      'linear-gradient(122.45deg, rgba(255, 231, 1, 0.2) 15.68%, rgba(250, 81, 211, 0.2) 39.58%, rgba(16, 217, 237, 0.2) 63.84%, rgba(82, 255, 83, 0.2) 85.21%)',
  },
  madeByContainer: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    display: 'flex',
  },
}));
