import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  icnsImg: {
    width: 60,
    height: 16,
    marginRight: 10,
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icnsContainer: {
    width: 370,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 500,
    transition: theme.transitions.create(['background', 'color']),
    background: '#F3F4F6',
    color: '#6B7280',
    padding: theme.spacing(1),
    marginBottom: 20,
  },
  active: {
    background: '#E1EAFE',
    color: '#3574F4',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  icnsButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
