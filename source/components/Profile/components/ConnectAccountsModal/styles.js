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
    maxHeight: 180,
    borderRadius: 10,
    border: walletBorder,
    marginTop: 10,
    overflow: 'auto',
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
  scrollShadow: {
    boxShadow: 'inset 0 -10px 10px -10px rgb(0 0 0 / 0.4)',
    transition: 'box-shadow 0.3s',
  },
  modalContainer: {
    top: 100,
  },
  walletConnected: {
    opacity: 0.6,
  },
  walletName: {
    fontWeight: 'bold',
  },
});
