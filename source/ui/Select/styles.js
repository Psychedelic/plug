import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles((theme) => ({
  root: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    transition: 'background 0.2s',
    width: '100%',
    borderRadius: 10,
  },
  selectable: {
    cursor: 'pointer',
    '&:hover': {
      background: '#F3F4F6',
    },
  },
  readonly: {
    pointer: 'none',
  },
  icon: {
    height: 29,
    width: 29,
    marginRight: theme.spacing(1),
  },
  iconShadow: {
    borderRadius: 26,
    boxShadow: SHADOW_1,
  },
  alignRight: {
    marginLeft: 'auto',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));
