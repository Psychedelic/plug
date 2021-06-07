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
    width: '100%',
    height: '100%',
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
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
