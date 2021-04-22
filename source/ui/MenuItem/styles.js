import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  icon: {
    minWidth: 'auto',
    paddingRight: theme.spacing(1),
  },
  text: {
    paddingRight: theme.spacing(1),
  },
  big: {
    minHeight: 42,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  border: {
    '&:before': {
      content: '""',
      position: 'absolute',
      left: theme.spacing(2),
      right: theme.spacing(2),
      width: 'auto',
      bottom: 0,
      height: 1,
      borderBottom: '1px solid #E8EBEF',
    },
  },
}));
