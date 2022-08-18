import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  networkCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    width: '100%',
    padding: '16px 24px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  networkData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  removeIcon: {
    width: 20,
    height: 22,
  },
}));
