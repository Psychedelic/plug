import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  network: {
    margin: '17px 0',
    opacity: 0.5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  activeNetwork: {
    opacity: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#C9C9C9',
    marginRight: 5,
  },
  activeDot: {
    backgroundColor: '#08DE92',
  },
  check: {
    width: 14,
    height: 20,
  },
  networkId: {
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    width: 195,
    padding: '0 10px',
    border: '1px solid #E5E7EB',
  },
}));
