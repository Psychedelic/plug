import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
  },
  active: {
    background: theme.palette.success.main,
  },
  inactive: {
    background: '#D1D5DB',
  },
  web: {
    fontWeight: 700,
  },
}));
