import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 16,
    color: theme.palette.common.gray,
    minWidth: 72,
    padding: '0px',

    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    '&$selected': {
      color: theme.palette.primary.main,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
  selected: {},
  container: {
    position: 'relative',
    overflow: 'hidden',
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },
  loader: {
    position: 'absolute',
    width: '5px',
    height: '2px',
    backgroundColor: '#FFFFFF',
    bottom: 0,
    zIndex: 10000,
    animation: '$loader 2000ms infinite',
  },
  '@keyframes loader': {
    '0%': {
      transform: 'translateX(-5px) rotate(30deg)',
    },
    '100%': {
      transform: 'translateX(100px) rotate(35deg)',
    },
  },
}));
