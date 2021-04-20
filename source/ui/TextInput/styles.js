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
    transition: 'border-color 0.15s linear',

    '&:focus': {
      border: '2px solid #111827',
      padding: '9px 11px',
    },
  },
}));
