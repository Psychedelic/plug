import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    zIndex: 1,
    background: '#FFFFFF',
    position: 'relative',
    flex: 1,
  },
  stickyHeader: {
    position: 'sticky',
    height: 108,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
