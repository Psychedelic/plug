import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  wrapper: {
    overflow: 'hidden',
    position: 'relative',
    transition: 'box-shadow 1s',
    marginBottom: 20,
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
  icnsBackground: {
    width: '100%',
    height: '100%',
  },
  icnsName: {
    position: 'absolute',
    bottom: '10%',
    left: '10%',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icnsLogo: {
    width: '40%',
    position: 'absolute',
    top: '10%',
    left: '10%',
  },
  large: {
    fontSize: 32,
  },
}));
