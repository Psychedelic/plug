import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
    height: 320,
  },
  tokenContainer: {
    height: 250,
    overflow: 'auto',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    bottom: 10,
    position: 'absolute',
  },
}));
