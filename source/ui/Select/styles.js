import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    transition: 'background 0.2s',

    '&:hover': {
      background: '#F3F4F6',
    },
  },
  icon: {
    height: 41,
    width: 41,
    marginRight: theme.spacing(1),
  },
  iconShadow: {
    borderRadius: 26,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
  },
  alignRight: {
    marginLeft: 'auto',
  },
}));
