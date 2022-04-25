import { makeStyles } from '@material-ui/core/styles';

const EXTENSION_HEIGHT = 438;

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(2)}px 0`,
    height: EXTENSION_HEIGHT,
  },
  image: {
    width: 46,
    height: 46,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    textAlign: 'center',
    height: EXTENSION_HEIGHT,
    whiteSpace: 'pre-line',
  },
  emptyText: {
    marginTop: 10,
  },
  emptyTitle: {
    marginTop: 10,
  },
}));
