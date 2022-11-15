import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  mnemonicContainer: {
    width: '100%',
    maxWidth: 702,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  mnemonicWordAction: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '8px',
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
  pasteMessage: {
    display: 'flex',
    alignItems: 'center',
    color: '#767676',
    opacity: 0.9,
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 5,
    height: 16,
    width: 16,
    opacity: 0.5,
  },
}));
