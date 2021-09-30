import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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
}));
