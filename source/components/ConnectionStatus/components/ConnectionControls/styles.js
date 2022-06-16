import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  root: {
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 25px',
    fontWeight: 500,
  },
  networkSelector: {
    width: 90,
    height: 30,
    borderRadius: 1000,
    background: 'white',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reloadIcon: {
    width: 14,
    height: 20,
  },
  reloadIconContainer: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    background: 'white',
    cursor: 'pointer',
  },
  statusDot: {
    width: 8,
    height: 8,
    background: '#08DE92',
    borderRadius: '50%',
    marginRight: 5,
  },
}));
