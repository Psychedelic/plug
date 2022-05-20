import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

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
    fontSize: 34,
  },
  big: {
    width: 60,
    height: 60,
  },
  medium: {
    width: 40,
    height: 40,
    '& > span': {
      transform: 'scale(0.7)',
    },
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
    boxShadow: SHADOW_1,
  },
  small: {
    width: 30,
    height: 30,
    '& > span': {
      transform: 'scale(0.5)',
    },
  },
});
