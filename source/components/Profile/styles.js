import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  fancyCircle: {
    width: 37,
    height: 37,
    border: 'double 2px transparent',
    borderRadius: '600px',
    backgroundImage:
      'linear-gradient(white, white), linear-gradient(to bottom right, #FFE701, #FA51D3, #10D9ED, #53FF54)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  button: {
    width: 37,
    height: 37,
    borderRadius: '600px',
    minWidth: 37,
    minHeight: 37,
  },
  label: {
    width: 'auto',
  },
  menu: {
    zIndex: 1,
  },
  icon: {
    minWidth: 40,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 500,
  },
});
