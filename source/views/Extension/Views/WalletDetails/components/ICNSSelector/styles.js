import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  icnsSelectContainer: {
    borderRadius: 6,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    transition: 'background 0.2s',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    margin: '10px 0',
  },
  changeText: {
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#3574F4',
  },
  arrowDown: {
    color: '#111827',
    width: 20,
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(2)}px`,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#F3F4F6',
    },
  },
  name: {
    fontWeight: 500,
    fontSize: 16,
    padding: '15px 0',
  },
  borderBottom: {
    borderBottom: '1px solid #E5E7EB',
  },
}));
