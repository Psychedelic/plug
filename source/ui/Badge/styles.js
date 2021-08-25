import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: 'fit-content',
    padding: '16px 12px',
    borderRadius: 10,
    background: '#F3F4F6',
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    color: '#6B7280',
    fontWeight: 500,
    fontSize: 12,
    textTransform: 'uppercase',
    paddingTop: 6,
  },
  value: {
    fontSize: 14,
    color: '#000000',
  },
}));
