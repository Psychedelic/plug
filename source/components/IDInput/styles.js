import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    height: 'fit-content',
    right: theme.spacing(1),
    top: 0,
    bottom: 0,
    display: 'flex',
    margin: 'auto',
  },
  icon: {
    width: 21,
    height: 21,
  },
  spinner: {
    color: '#6B7280',
  },
  input: {
    height: 65,
    padding: '0 12px',
    boxSizing: 'border-box',
    color: theme.palette.common.primaryBlack,
    borderRadius: 10,
    fontWeight: 500,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #D1D5DB',
    fontSize: 18,
    width: '100%',
    boxShadow: '0px 1px 2px rgb(0 0 0 / 5%)',

    '&:hover': {
      border: 'double 1px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    '&:focus': {
      padding: '0px 11px',
      border: 'double 2px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
}));
