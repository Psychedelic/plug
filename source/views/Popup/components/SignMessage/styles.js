import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  padTop: {
    paddingTop: 35,
    height: '100%',
  },
  container: {
    justifyContent: 'space-between',
  },
  tokenImage: {
    position: 'relative',
    height: 41,
    width: 41,
    marginRight: theme.spacing(1),
  },
}));
