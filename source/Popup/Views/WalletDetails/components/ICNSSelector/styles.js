import { makeStyles } from '@material-ui/core/styles';
import { SHADOW_1 } from '@shared/styles/shadows';

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
    marginTop: 10,
  },
  changeText: {
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#3574F4', 
  },
  arrowDown: {
    color: '#111827',
    width: 20,
  },
}));
