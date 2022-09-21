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
    borderRadius: '100%',
    '& > img': {
      borderRadius: '100%',
    }
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
    height: 190,
    margin: '12px 0',
  },
  emoji: {
    fontSize: 32,
  },
  tokensContainer: {
    height: 202,
    margin: '0 0 12px 0',
    overflow: 'auto',
  },
  poweredByDab: {
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
    bottom: 8,
  },
  dabTokenContainer: {
    height: 190,
    margin: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'relative',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 12px',
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
