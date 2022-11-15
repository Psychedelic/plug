import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: 350,
    height: 134,
    cursor: 'pointer',
    transition: 'transform 0.3s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    flexDirection: 'column',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    zIndex: 100000,
  },
  text: {
    fontWeight: 700,
    fontSize: 16,
    color: theme.palette.common.white,
    paddingTop: theme.spacing(0.75),
  },
}));
