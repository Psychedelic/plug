import { makeStyles } from '@material-ui/core';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles(() => ({
  background: {
    width: '100%',
    height: '100vh',
    zIndex: 5,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 250,
    padding: '20px 20px 0 20px',
    position: 'absolute',
    top: 50,
    right: 10,
    background: '#FFFFFF',
    borderRadius: 6,
    boxShadow: SHADOW_1,
    zIndex: 10000,
  },
  selectorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  networksContainer: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
    maxHeight: 330,
    overflow: 'auto',
  },
}));
