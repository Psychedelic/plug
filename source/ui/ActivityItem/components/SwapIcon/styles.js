import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: 41,
    width: 41,
    cursor: 'pointer',
  },
  image: {
    height: 24,
    width: 24,
    borderRadius: 26,
    position: 'absolute',
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
  },
  fromImage: {
    top: -3,
    left: -3,
  },
  toImage: {
    right: -3,
    bottom: -3,
  },
  swapImage: {
    position: 'absolute',
    left: 7,
    bottom: 5,
  },
  hovered: {
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
}));
