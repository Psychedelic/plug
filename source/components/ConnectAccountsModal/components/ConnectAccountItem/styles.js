import { makeStyles } from '@material-ui/core/styles';

const walletBorder = '1px solid #D1D5DB';

export default makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  checkbox: {
    width: 'auto !important',
  },
  walletContainer: {
    padding: 10,
    borderTop: walletBorder,
    '&:first-child': {
      borderTop: 'none',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  walletConnected: {
    opacity: 0.6,
  },
  walletName: {
    fontWeight: 'bold',
  },
});
