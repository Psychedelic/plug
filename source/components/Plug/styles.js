import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  small: {
    width: 32,
    height: 45,
  },
  medium: {
    width: 50,
    height: 73,
  },
  big: {
    width: 80,
    height: 116,
  },
  root: {
    position: 'relative',
  },
  triangle: {
    position: 'absolute',
    top: 46,
    right: -27,
    zIndex: 2,
  },
  globe: {
    position: 'absolute',
    width: 'max-content',
    left: 93,
    top: 30,
    background: 'white',
    boxShadow:
      '0px 0px 0px rgb(6 44 82 / 10%), 0px 1px 3px rgb(64 66 69 / 12%), 0px 2px 16px rgb(33 43 54 / 8%)',
    borderRadius: 28,
    padding: '9px 14px',
    color: theme.palette.common.primaryBlack,
    fontSize: 14,
    lineHeight: '16.8px',
    textAlign: 'center',
    zIndex: 1,
  },
}));
