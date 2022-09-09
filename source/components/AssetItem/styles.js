import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  '@keyframes swipeLeft': {
    from: { transform: 'translateX(0px)' },
    to: { transform: 'translateX(-100%)' },
  },
 removeAnimation: {
    animation: '$swipeLeft 0.6s forwards',
  },
  image: {
    height: 41,
    width: 41,
    boxShadow: SHADOW_1,
    borderRadius: 26,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: theme.spacing(1),
  },
  value: {
    marginLeft: 'auto',
    alignSelf: 'flex-start',
  },
  valueSkeleton: {
    width: 50,
    height: 15,
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 0.6,
    },
    '70%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.6,
    },
  },
  pulse: {
    opacity: 1,
    animation: '$pulse 2s infinite',
  },
  failedContainer: {
    backgroundColor: '#F3F5F9',
  },
  failedTitle: {
    color: '#6B707B',
    fontSize: 16,
  },
  failedDescription: {
    color: '#6B707B',
    fontStyle: 'italic',
    fontSize: 16,
  },
  refresh: {
    alignSelf: 'center',
    cursor: 'pointer',

    '&:hover': {
      opacity: 0.9,
    },
  },
  deleteToken: {
    opacity: 0,
    width: 0,
    transition: '0.6s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTokenMoveRight: {
    marginLeft: 'auto !important',
  },
  deleteTokenActive: {
    opacity: 1,
    margin: '0 4px 0 21px',

    '& > img': {
      cursor: 'pointer',
    }
  }
}));
