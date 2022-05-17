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
    borderRadius: 42,
    height: 42,
    width: 42,
    backgroundColor: theme.palette.common.blue,
    cursor: 'pointer',

    '&:hover': {
      opacity: 0.9,
    },
  },
  icon: {
    color: 'white',
  },
  scrollShadow: {
    boxShadow: 'inset 0 -10px 10px -10px rgb(0 0 0 / 0.4)',
    transition: 'box-shadow 0.3s',
  },
}));
