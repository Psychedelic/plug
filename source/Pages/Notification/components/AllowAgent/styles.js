import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  padTop: {
    paddingTop: 25,
  },
  arrowUpRight: {
    cursor: 'pointer',
  },
  whitelistContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    marginBottom: 24,
    maxHeight: 173,
    overflow: 'auto',
  },
  whitelistItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '9px 0',
  },
});
