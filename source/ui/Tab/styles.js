import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 16,
    color: theme.palette.common.gray,
    marginLeft: theme.spacing(2),
    minWidth: 72,

    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    '&$selected': {
      color: theme.palette.primary.main,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
  selected: {},
}));
