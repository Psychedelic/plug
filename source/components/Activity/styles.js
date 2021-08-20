import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(2)}px 0`,
    height: 320 + 118,
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
    height: 320 + 118,
    whiteSpace: 'pre-line',
  },
  emptyText: {
    marginTop: 10,
  },
  emptyTitle: {
    marginTop: 10,
  },
}));
