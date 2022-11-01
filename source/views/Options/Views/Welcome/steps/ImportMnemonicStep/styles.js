import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  mnemonicContainer: {
    width: '100%',
    maxWidth: 702,
  },
  mnemonicWordsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  mnemonicWordInputContainer: {
    width: '100%',
    maxWidth: 200,
    margin: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mnemonicWordInput: {
    height: 30,
    maxWidth: 150,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    marginBottom: theme.spacing(2),
  },
  footerContainer: {
    padding: '0 45px',
  },
  passwordInputContainer: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  passwordInput: {
    maxWidth: 290,
  },
}));
