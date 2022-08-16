import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: 70,
    height: 70,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  icon: {
    color: 'white',
    padding: theme.spacing(0.5),
  },
  iconDeposit: {
    background:
      'radial-gradient(85.62% 86.59% at 48.78% 48.78%, #FFE701 0%, #FA51D3 48.01%)',
    boxShadow: '0px 0px 10px rgba(251, 101, 184, 0.6)',
  },
  iconSend: {
    background:
      'radial-gradient(85.62% 86.59% at 48.78% 48.78%, #FA51D3 0%, #10D9ED 53.64%)',
    boxShadow: '0px 0px 10px rgba(71, 186, 231, 0.6)',
  },
  iconSwap: {
    background:
      'radial-gradient(85.62% 86.59% at 48.78% 48.78%, whitesmoke 0%, grey 67.19%)',
  },
  textDeposit: {
    background: 'linear-gradient(102.53deg, #FB5DC3 5.45%, #FDB943 96.36%)',
  },
  textSend: {
    background: 'linear-gradient(103.8deg, #36C3E9 5.92%, #CF6ED3 84.31%)',
  },
  textSwap: {
    background: 'linear-gradient(102.05deg, grey 5.28%, darkgrey 83.22%)',
  },
  text: {
    WebkitBackgroundClip: 'text !important',
    WebkitTextFillColor: 'transparent',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 4,
  },
  tooltip: {
    margin: '8px 0',
  },
}));
