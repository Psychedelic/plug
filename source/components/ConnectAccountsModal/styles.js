import { makeStyles } from '@material-ui/core/styles';

const walletBorder = '1px solid #D1D5DB';

export default makeStyles({
  modalContainer: {
    top: 100,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  appImage: {
    height: 51,
    width: 51,
    borderRadius: 12,
  },
  title: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textAlign: 'center',
    marginBottom: 10,
    maxWidth: 320,
  },
  scrollShadow: {
    boxShadow: 'inset 0 -10px 10px -10px rgb(0 0 0 / 0.4)',
    transition: 'box-shadow 0.3s',
  },
  walletsContainer: {
    maxHeight: 180,
    borderRadius: 10,
    border: walletBorder,
    marginTop: 10,
    overflow: 'auto',
  },
});
