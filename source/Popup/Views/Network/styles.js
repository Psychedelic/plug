import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  networkContainer: {
    height: 425,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addNetwork: {
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
  plusIcon: {
    color: 'white',
  },
}));
