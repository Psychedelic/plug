import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  card: {
    width: 300,
    height: 200,
    borderRadius: 8,
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 600,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
