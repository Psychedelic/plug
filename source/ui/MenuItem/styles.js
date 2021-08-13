import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  icon: {
    minWidth: 'auto',
    paddingRight: theme.spacing(1),
  },
  text: {
    paddingRight: theme.spacing(1),
  },
  small: {
    minHeight: 42,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  big: {
    minHeight: 54,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  smallImage: {
    width: 22,
    height: 22,
  },
  bigImage: {
    width: 41,
    height: 41,
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
  alignLeft: {
    marginLeft: -3,
    marginRight: 3,
  },
  comingSoon: {
    marginLeft: 'auto',
    display: 'flex',
  },
  selected: {
    background: 'linear-gradient(94.95deg, rgba(255, 231, 1, .2) -1.41%, rgba(250, 81, 211, 0.2) 34.12%, rgba(16, 217, 237, .2) 70.19%, rgba(82, 255, 83, .2) 101.95%)',
  },
}));
