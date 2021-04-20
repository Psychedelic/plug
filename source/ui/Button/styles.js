import { makeStyles } from '@material-ui/core/styles';

const defaultBoxShadow = '0px 1px 2px rgba(0, 0, 0, 0.05)';
const boxShadow = '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)';

export default makeStyles((theme) => ({
  root: {
    minWidth: 130,
    fontSize: 16,
    lineHeight: '16px',
    borderRadius: '10px',
    textTransform: 'none',
    transition: 'all 0.3s',
    height: 42,
    '&:hover, &:active': {
      transform: 'scale(1.03)',
    },
  },
  rainbow: {
    fontWeight: 700,
    color: 'white',
    background: theme.palette.primary.mainGradient,
    boxShadow,
    '&:hover': {
      opacity: 0.9,
      boxShadow,
    },
    '&:disabled': {
      opacity: 0.6,
      color: 'white',
      boxShadow,
    },
  },
  danger: {
    fontWeight: 700,
    color: 'white',
    background: theme.palette.danger.main,
    boxShadow,

    '&:hover': {
      opacity: 0.9,
      background: theme.palette.danger.main,
      boxShadow,
    },
    '&:disabled': {
      opacity: 0.6,
      color: 'white',
      background: theme.palette.danger.main,
      boxShadow,
    },
  },
  default: {
    fontWeight: 500,
    color: '#374151',
    border: '1px solid #D1D5DB',
    boxShadow: defaultBoxShadow,
    '&:hover': {
      opacity: 0.9,
      boxShadow: defaultBoxShadow,
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: defaultBoxShadow,
    },
  },
}));
