import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px 8px',
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 400,
    color: '#6B7280',
  },
});
