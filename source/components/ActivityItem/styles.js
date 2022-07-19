import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  pointer: {
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
  },
  transactionDetailsContainer: {
    padding: '0 15px 15px',
  },
}));
