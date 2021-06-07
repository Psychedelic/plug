import { makeStyles } from '@material-ui/core/styles';
import CheckedIcon from '@assets/icons/check.svg';

export default makeStyles((theme) => ({
  formLabel: {
    width: '100%',
    margin: 0,
  },
  root: {
    padding: 0,
    marginRight: theme.spacing(0.75),
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 4,
    width: 16,
    height: 16,
    border: '1px solid #D1D5DB',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#006EFF',
    border: '1px solid #006EFF',
    boxSizing: 'border-box',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 10,
      height: 8,
      backgroundImage: `url(${CheckedIcon})`,
      position: 'absolute',
      top: 0,
      left: 0.5,
      right: 0,
      bottom: 0,
      margin: 'auto',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#006EFF',
    },
  },
}));
