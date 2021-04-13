import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    background: '#04CD95',
  },
  inactive: {
    background: 'linear-gradient(90.55deg, #D1D5DB 6.97%, #D1D5DB 100.15%)',
  },
});
