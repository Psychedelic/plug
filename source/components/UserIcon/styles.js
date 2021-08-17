import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  fancyCircle: {
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
  big: {
    width: 50,
    height: 50,
    fontSize: 25,
  },
  medium: {
    width: 40,
    height: 40,
    fontSize: 22,
  },
  small: {
    width: 30,
    height: 30,
    fontSize: 16,
  },
});
