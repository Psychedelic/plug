import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  centered: {
    textAlign: 'center',
    padding: '0 32px',
  },
  tokenItem: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 0',
  },
  tokenImage: {
    position: 'relative',
    height: 41,
    width: 41,
    marginRight: theme.spacing(1),
  },
  verified: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
  confirmToken: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px 0`,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: theme.spacing(1),
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: 'auto',
    textAlign: 'end',
  },
  emptyResults: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: 105,
  },
  emoji: {
    marginBottom: 12,
    fontSize: 32,
  },
  dabTokenContainer: {
    height: 227,
    margin: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'relative',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 12px',
  },
  comingSoon: {
    position: 'absolute',
    top: 12,
    right: 18,
    transform: 'rotate(20.66deg)',
    borderRadius: 10,
    color: '#000000',
    fontWeight: 500,
    padding: '3px 9px',
    border: 'double 2px transparent',
    backgroundImage:
      'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  },
  dabImage: {
    height: 57,
    width: 57,
    cursor: 'pointer',
  },
  '@keyframes appear': {
    '0%': {
      opacity: '0',
      height: 0,
    },
    '100%': {
      opacity: '1',
      height: 51,
    },
  },
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  learnMore: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  select: {
    height: 47,
    borderRadius: 6,
  },
}));
