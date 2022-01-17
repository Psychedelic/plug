import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
    height: 320,
  },
  tokenContainer: {
    height: 250,
    overflow: 'auto',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    background: '#3574F4',
    filter: 'box-shadow(0px 2px 16px 0px #212B3614) box-shadow(0px 1box 3px 0px #4042451F) box-shadow(0px 0px 32px 8px #062C521A)',
    borderRadius: '100%',
    width: '41px',
    height: '41px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
}));
