import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  info: {
    marginLeft: 9,
  },
  globe: {
    marginLeft: 15,
    marginRight: 9,
  },
  accountContainer: {
    width: 370,
    height: 53,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 500,
    transition: theme.transitions.create(['background', 'color']),
  },
  publicAccount: {
    background: '#E1EAFE',
    color: '#3574F4',
  },
  privateAccount: {
    background: '#F3F4F6',
    color: '#6B7280',
  },
}));
