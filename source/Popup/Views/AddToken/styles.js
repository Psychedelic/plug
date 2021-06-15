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
    marginLeft: theme.spacing(1),
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
    height: 105,
  },
  emoji: {
    marginBottom: 12,
    fontSize: 32,
  },
}));
