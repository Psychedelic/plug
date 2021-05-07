import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    height: 144,
    textAlign: 'center',
  },
  image: {
    width: 46,
    height: 46,
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.common.blue,

    '&:hover': {
      opacity: 0.9,
    },
  },
}));
