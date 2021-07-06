import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    height: 61,
    width: 195,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: '10px',
    cursor: 'pointer',
    '&:hover': {
      background: '#F3F4F6',
    },
  },
  tooltip: {
    margin: '8px 0',
  },
});
