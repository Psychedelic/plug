import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  innerContainer: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
  },
  detailsInnerContainer: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
    marginBottom: 38,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.5),
  },
  amountContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'end',
    height: 50,
  },
  amount: {
    color: theme.palette.common.blue,
    fontSize: '25px',
    lineHeight: '25px',
    fontWeight: 800,
  },
  trillion: {
    color: theme.palette.common.blue,
    fontSize: 20,
    marginLeft: 3,
  },
  requestHandler: {
    width: '100%',
    height: 40,
    background: '#B5B7BB',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  },
  arrow: {
    fontWeight: 500,
    color: 'white',
    cursor: 'pointer',
    position: 'absolute',
  },
  requestCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    width: 'fit-content',
  },
  left: {
    left: theme.spacing(2),
  },
  right: {
    right: theme.spacing(2),
  },
  buttonsWrapper: {
    padding: '0 24px 12px',
  },
}));
