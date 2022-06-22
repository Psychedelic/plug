import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  networkContainer: {
    height: 425,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noNetworksContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 280,
    maxWidth: 200,
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 80,
  },
  networkIcon: {
    height: 50,
  },
}));
