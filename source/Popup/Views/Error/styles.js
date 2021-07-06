import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
    padding: '20px 10px',
    width: '100%',
  },
  image: {
    width: 25,
    height: 25,
  },
}));
