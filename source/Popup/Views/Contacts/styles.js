import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  divider: {
    height: 30,
    background: '#F3F4F6',
    width: '100%',
    padding: `0 ${theme.spacing(2)}px`,
    borderTop: '1px solid #E5E7EB',
    borderRight: 'none',
    borderLeft: 'none',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
  },
  contact: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}px`,
    height: 80,
    borderTop: '1px solid #E5E7EB',
  },
  nameContainer: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: 41,
    width: 41,
    borderRadius: 41,
  },
  icon: {
    cursor: 'pointer',
    fontSize: 18,
    transition: 'transform 0.3s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  copyIcon: {
    color: '#367FF8',
    marginLeft: 'auto',
    height: 18,
  },
  deleteIcon: {
    color: '#111827',
    marginLeft: theme.spacing(1),
  },
  contactContainer: {
    height: 331,
    overflowY: 'auto',
  },
  line: {
    borderTop: '1px solid #E5E7EB',
    width: '100%',
  },
  '@keyframes appear': {
    '0%': {
      opacity: '0',
      height: 0,
      padding: 0,
    },
    '100%': {
      opacity: '1',
      height: 43,
      padding: 12,
    },
  },
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  danger: {
    color: 'rgb(220, 38, 38)',
  },
}));
