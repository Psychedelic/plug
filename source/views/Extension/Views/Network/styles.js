import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  networkContainer: {
    height: 425,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  letterHeader: {
    height: 30,
    background: '#F3F4F6',
    width: '100%',
    padding: `0 ${theme.spacing(2)}px`,
    borderTop: '1px solid #E5E7EB',
    borderRight: 'none',
    borderLeft: 'none',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
  },
}));
