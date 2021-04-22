import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: 262,
    height: 114,
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.3s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  blur: {
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(96.51deg, rgba(255, 231, 1, 0.8) 8.72%, rgba(255, 0, 196, 0.8) 38.27%, rgba(0, 232, 255, 0.8) 68.28%, rgba(0, 255, 1, 0.8) 94.7%)',
    filter: 'blur(25px)',
    borderRadius: 300,
  },
  center: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 700,
    fontSize: 16,
    color: theme.palette.common.white,
    paddingLeft: theme.spacing(0.75),
  },
}));
