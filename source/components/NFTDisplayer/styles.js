import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  iframeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    '& > iframe': {
      border: 'none',
    },
  },
  iframeClick: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 10000,
  },
  innerFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  interactive: {
    borderRadius: 15,
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: 280,
    margin: 'auto',
  },
  wrapper: {
    overflow: 'hidden',
    position: 'relative',
    transition: 'box-shadow 1s',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#E9EBEF',
    zIndex: 1000,
  },
  loadingWrapper: {
    boxShadow: 'none',
  },
}));
