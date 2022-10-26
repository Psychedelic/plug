import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  fancyCircle: {
    width: 37,
    height: 37,
    border: 'double 2px transparent',
    borderRadius: '600px',
    backgroundImage:
      'linear-gradient(white, white), linear-gradient(to bottom right, #FFE701, #FA51D3, #10D9ED, #53FF54)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 20px 10px',
  },
  button: {
    width: 37,
    height: 37,
    borderRadius: '600px',
    minWidth: 37,
    minHeight: 37,
  },
  removeAccountDialog: {
    padding: '0px 20px 10px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    width: 'auto',
  },
  hiddenAccount: {
    color: 'rgba(0, 0, 0, 0.26)',
    opacity: 0.7,
  },
  menu: {
    zIndex: 1,
  },
  drawer: {
    zIndex: '500 !important',
  },
  container: {
    paddingTop: 108,
  },
  myAccounts: {
    fontWeight: 600,
  },
  paper: {
    width: 293,
  },
  accountContainer: {
    maxHeight: 284,
    overflow: 'auto',
    paddingBottom: 0,
  },
  settingContainer: {
    paddingTop: 0,
  },
  createAccountInput: {
    marginBottom: '6px',
  },
  errorMessage: {
    color: theme.palette.danger.main,
  },
}));
