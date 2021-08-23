import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    borderRadius: 6,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #D1D5DB',
    fontSize: 16,
    width: '100%',
    padding: '4px 12px',
    boxShadow: '0px 1px 2px rgb(0 0 0 / 5%)',

    '&:focus': {
      border: 'none',
    },

    'label + &': {
      marginTop: theme.spacing(2),
    },
  },
  hover: {
    '&:hover': {
      border: 'double 1px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
  error: {
    border: `2px solid ${theme.palette.danger.main} !important`,
    padding: '3px 11px !important',
  },
  focus: {
    padding: '3px 11px',
    borderRadius: 6,
    border: 'double 2px transparent !important',
    backgroundImage:
      'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54) !important',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  },
}));
