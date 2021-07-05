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
    transition: 'transform 0.3s',
    height: 42,
    '&:hover, &:active': {
      transform: 'scale(1.03)',
    },
  },
  primary: {
    fontWeight: 700,
    color: 'white',
    background: theme.palette.primary.main,
    boxShadow,
    '&:hover': {
      opacity: 0.9,
      boxShadow,
      background: theme.palette.primary.main,
    },
    '&:disabled': {
      opacity: 0.6,
      color: 'white',
      boxShadow,
      background: theme.palette.primary.main,
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
  primaryOutlined: {
    padding: '4px 12px',
    minWidth: 'auto',
    height: 'auto',
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    color: '#3775F4',
    border: '1px solid #3775F4',
    boxShadow: 'none',
    '&:hover': {
      opacity: 0.9,
      boxShadow: 'none',
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: 'none',
    },
  },
  rainbowOutlined: {
    color: '#111827',
    border: 'double 2px transparent',
    backgroundImage:
      'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: 'none',
    '&:hover': {
      opacity: 0.9,
      boxShadow: 'none',
    },
    '&:disabled': {
      opacity: 0.6,
      boxShadow: 'none',
    },
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));
