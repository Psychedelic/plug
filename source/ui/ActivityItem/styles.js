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
    borderRadius: 10,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: theme.spacing(1),
  },
  pending: {
    color: '#FBBF24',
  },
  failed: {
    color: '#DC2626',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    textAlign: 'end',
  },
  pluggedTitle: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 331,
  },
  pointer: {
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
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
  values: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    textAlign: 'end',
  },
  tooltip: {
    margin: '8px 0',
  },
  amountContainer: {
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
