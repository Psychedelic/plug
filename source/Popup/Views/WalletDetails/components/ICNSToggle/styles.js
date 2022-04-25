import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  info: {
    marginLeft: 9,
  },
  icnsImg: {
    width: 60,
    height: 16,
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  icnsContainer: {
    width: 370,
    height: 55,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 500,
    transition: theme.transitions.create(['background', 'color']),
    background: '#F3F4F6',
    color: '#6B7280',
    padding: `0px ${theme.spacing(1)}px`,
    marginBottom: 20,
  },
  active: {
    background: '#E1EAFE',
    color: '#3574F4',
  },
}));
