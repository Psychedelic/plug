import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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
  amountContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  detailsIcon: {
    marginRight: '5px',
  },
}));
