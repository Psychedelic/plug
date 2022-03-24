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
    cursor: 'pointer',
  },
  icon: {
    width: 23,
    height: 23,
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
      border: 'double 2px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
  inputInvalid: {
    border: `2px solid ${theme.palette.danger.main}`,

    '&:hover': {
      border: `2px solid ${theme.palette.danger.main}`,
    },
    '&:focus': {
      border: `2px solid ${theme.palette.danger.main}`,
    },
  },
  paddingRight: {
    paddingRight: '40px',
  },
  newAddress: {
    height: 51,
    width: '100%',
    borderRadius: 10,
    background: '#E1EAFE',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 ${theme.spacing(1)}px`,
    marginTop: 20,
  },
  newAddressTitle: {
    color: theme.palette.common.blue,
    fontWeight: 500,
    fontSize: 14,
  },
  '@keyframes appear': {
    '0%': {
      opacity: '0',
      height: 0,
    },
    '100%': {
      opacity: '1',
      height: 51,
    },
  },
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  errorMessage: {
    marginTop: 5,
    color: theme.palette.danger.main,
  },
}));
