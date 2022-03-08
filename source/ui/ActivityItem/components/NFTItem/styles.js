import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: theme.spacing(1),
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    textAlign: 'end',
  },
  iconContainer: {
    width: 0,
    opacity: 0,
    transition: '0.6s',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginLeft: 6,
  },
  iconContainerAnimation: {
    width: 15,
    opacity: 1,
    marginLeft: 10,
  },
  tooltip: {
    margin: '8px 0',
  },
  tokenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  transactionDetailsContainer: {
    padding: '0 15px 15px',
  },
  detailsIcon: {
    marginRight: '5px',
  },
}));
