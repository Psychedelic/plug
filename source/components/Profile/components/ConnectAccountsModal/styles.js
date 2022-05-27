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
  walletsContainer: {
    maxHeight: 190,
    borderRadius: 10,
    border: walletBorder,
    overflow: 'hidden',
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
  appImage: {
    height: 51,
    width: 51,
    borderRadius: 12,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textAlign: 'center',
    marginBottom: 10,
  },
});
