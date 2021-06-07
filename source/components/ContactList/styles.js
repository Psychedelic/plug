import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  divider: {
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
  contactContainer: {
    height: 298,
    overflowY: 'auto',
  },
  line: {
    borderTop: '1px solid #E5E7EB',
    width: '100%',
  },
}));
