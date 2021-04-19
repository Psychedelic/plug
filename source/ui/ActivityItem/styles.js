import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '12px 24px',
  },
  image: {
    height: 41,
    width: 41,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
    borderRadius: 26,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    color: '#111827',
    fontWeight: 500,
  },
  subtitle: {
    color: '#787B84',
    fontSize: 14,
  },
  pending: {
    color: '#FBBF24',
  },
  failed: {
    color: '#DC2626',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    textAlign: 'end',
  },
});
