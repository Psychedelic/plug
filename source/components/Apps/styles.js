import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(2)}px 0`,
    height: 320 + 118,
  },
  textContainer: {
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
  },
  centerTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
  emptyText: {
    marginTop: 10,
  },
  emptyTitle: {
    marginTop: 10,
  },
  canisterInfoContainer: {
    padding: '0 24px',
    maxHeight: '340px',
  },
}));
