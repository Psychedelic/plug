import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 16,
    color: theme.palette.common.gray,
    marginLeft: 16,
    minWidth: 72,

    '&:hover': {
      color: theme.palette.info.main,
      opacity: 1,
    },
    '&$selected': {
      color: theme.palette.info.main,
    },
    '&:focus': {
      color: theme.palette.info.main,
    },
  },
  selected: {},
}));
