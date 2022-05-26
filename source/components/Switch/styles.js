import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    width: 44,
    height: 24,
    padding: 0,
  },
  switchBase: {
    top: 1,
    left: 1,
    padding: 1,
    '&$checked': {
      transform: 'translateX(19px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#3574F4',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#3574F4',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 20,
    height: 20,
  },
  track: {
    borderRadius: 24 / 2,
    border: '1px solid #9CA3AF',
    backgroundColor: '#9CA3AF',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}));
