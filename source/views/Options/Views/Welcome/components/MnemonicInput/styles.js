import { makeStyles } from '@material-ui/core/styles';

import RAINBOW_GRADIENT from '@shared/styles/gradients';

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
    color: theme.palette.common.blue,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    padding: '10px 15px',
    borderRadius: 5,
    border: 'double 1px transparent',
    backgroundImage: RAINBOW_GRADIENT,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  },
}));
