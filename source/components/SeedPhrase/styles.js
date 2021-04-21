import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    background: theme.palette.common.white,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
    borderRadius: 10,
    padding: 2,
    position: 'relative',
    cursor: 'pointer',

    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      padding: 0,
      border: 'double 2px transparent',
      backgroundImage:
        'linear-gradient(white, white), radial-gradient(circle at top left,#FFE701,#FA51D3,#10D9ED,#53FF54)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
  },
  item: {
    flex: '1 1 30%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copy: {
    WebkitBackgroundClip: 'text !important',
    WebkitTextFillColor: 'transparent',
    fontSize: 22,
    fontWeight: 600,
    background:
      'linear-gradient(91.38deg, #FFE802 -2.08%, #E061D6 34.61%, #18DEDC 61.72%, #54FF55 100%)',
  },
}));
