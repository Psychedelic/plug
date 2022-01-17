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
    borderRadius: '100%',
    boxShadow: '0px 0px 32px 8px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
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
