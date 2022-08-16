import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 6,
    padding: '14px 12px',
    fontWeight: 500,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    whiteSpace: 'pre-line',
  },
  warning: {
    background: '#FFFBEB',
    color: '#92400E',
  },
  danger: {
    background: 'rgba(224, 65, 65, 0.15)',
    color: '#E04141',
  },
  info: {
    background: '#F3F4F6',
    color: '#111827',
    fontSize: 16,
    fontWeight: 'normal',
  },
  icon: {
    fontSize: 18,
    cursor: 'pointer',
  },
  iconwarning: {
    color: '#FBBF24',
  },
  icondanger: {
    color: '#111827',
  },
  iconinfo: {
    color: '#111827',
  },
  startIcon: {
    marginRight: theme.spacing(1),
  },
  endIcon: {
    marginLeft: 'auto',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
