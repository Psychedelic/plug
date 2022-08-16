import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  subtitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comingSoon: {
    height: 170,
    marginTop: `-${theme.spacing(2)}px`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    textAlign: 'center',
  },
  infoRow: {
    margin: '8px 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
