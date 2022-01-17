import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
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
    alignItems: 'center',
    bottom: 24,
    right: 24,
    position: 'absolute',
    borderRadius: 41,
    height: 41,
    width: 41,
    backgroundColor: theme.palette.common.blue,
    cursor: 'pointer',

    '&:hover': {
      opacity: 0.9,
    },
  },
  icon: {
    color: 'white',
  },
}));
