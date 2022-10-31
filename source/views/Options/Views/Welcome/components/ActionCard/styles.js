import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: theme.spacing(2),
    alignItems: 'center',
    height: 250,
    width: '100%',
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
    maxWidth: 420,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  image: {
    marginBottom: theme.spacing(1),
  },
}));
