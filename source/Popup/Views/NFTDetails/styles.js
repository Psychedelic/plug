import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {

  },
  image: {
    borderRadius: 15,
    filter: 'drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.25))',
    width: 280,
    height: 280,
    margin: 'auto',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px 0 12px 0',
  },
  section: {
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
}));
