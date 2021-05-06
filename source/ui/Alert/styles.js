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
  },
  warning: {
    background: '#FFFBEB',
    color: '#92400E',
  },
  icon: {
    fontSize: 18,
    marginRight: theme.spacing(1),
  },
  warningIcon: {
    color: '#FBBF24',
  },
}));
