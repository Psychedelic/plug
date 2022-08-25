import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  image: {
    borderRadius: 15,
    width: 280,
    height: 280,
    margin: 'auto',
    boxShadow: 'rgb(37 41 46 / 20%) 0px 10px 30px',
    cursor: 'pointer',
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
  description: {
    whiteSpace: 'pre-line',
  },
  icnsIcon: {
    width: '100%',
    padding: 5,
    height: 'auto',
  },
  expandIcon: {
    width: '16px',
    height: '18px',
    cursor: 'pointer',
  },
}));
