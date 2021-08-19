import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 65,
    background: 'white',
    borderRadius: 10,
    border: '1px solid #D1D5DB',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    padding: '12px 16px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    transition: 'background 0.2s',

    '&:hover': {
      padding: '11px 16px',
      border: 'double 1px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
  selected: {
    padding: '10px 15px',
    border: 'double 2px transparent',
    backgroundImage:
      'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  },
  iconLeft: {
    height: 38,
    width: 38,
    marginRight: theme.spacing(1),
    borderRadius: 38,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
  },
  iconRight: {
    height: 18,
    width: 18,
    marginLeft: 'auto',
  },
}));
