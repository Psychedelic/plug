import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  innerContainer: {
    padding: `0px ${theme.spacing(2)}px`,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cyclesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  amount: {
    color: theme.palette.common.blue,
    fontSize: 30,
    lineHeight: '36px',
    fontWeight: 800,
  },
  trillion: {
    color: theme.palette.common.blue,
  },
}));
