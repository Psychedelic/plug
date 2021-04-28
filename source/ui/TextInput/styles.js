import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(2),
    },
  },
  input: {
    borderRadius: 10,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #D1D5DB',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    boxShadow: '0px 1px 2px rgb(0 0 0 / 5%)',

    '&:hover': {
      border: 'double 1px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    '&:focus': {
      padding: '9px 11px',
      border: 'double 2px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
}));
