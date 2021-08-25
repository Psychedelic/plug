import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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
    padding: '36px 24px 12px 24px',
  },
  section: {
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 24px 14px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  content: {
    paddingTop: 15,
    display: 'flex',
    flexWrap: 'wrap',
  },
}));
