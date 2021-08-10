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
    position: 'relative',
  },
  big: {
    width: 60,
    height: 60,
    fontSize: 34,
  },
  small: {
    width: 40,
    height: 40,
    fontSize: 22,
  },
  edit: {
    cursor: 'pointer',
    position: 'absolute',
    background: 'rgb(0,0,0,0.7)',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    boxShadow: '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
  }
});
