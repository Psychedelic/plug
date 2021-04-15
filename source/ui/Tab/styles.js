import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    textTransform: 'none',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 16,
    minWidth: 72,

    '&:hover': {
      color: '#3574F4',
      opacity: 1,
    },
    '&$selected': {
      color: '#3574F4',
    },
    '&:focus': {
      color: '#3574F4',
    },
  },
  selected: {},
});
