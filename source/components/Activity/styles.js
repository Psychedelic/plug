import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(2)}px 0`,
    height: 320 + 118,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    height: 144,
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  image: {
    width: 46,
    height: 46,
  },
}));
