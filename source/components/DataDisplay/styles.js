import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    padding: '8px 18px',
    background: '#F3F4F6',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  big: {
    height: 130,
    overflowY: 'auto',
  },
  text: {
    color: theme.palette.common.primaryBlack,
    fontSize: 16,
    lineHeight: '19.2px',
    whiteSpace: 'pre-wrap',
  },
}));
