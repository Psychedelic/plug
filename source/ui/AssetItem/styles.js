import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  image: {
    height: 41,
    width: 41,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
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
}));
