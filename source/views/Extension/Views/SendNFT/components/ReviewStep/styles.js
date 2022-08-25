import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => ({
  reviewStepContainer: {
    padding: '0 22px 22px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorBox: {
    marginTop: 20,
    animationName: '$appear',
    animationDuration: '0.5s',
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
}));
