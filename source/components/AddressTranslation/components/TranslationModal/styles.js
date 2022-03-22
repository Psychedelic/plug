import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => ({
  modal: {
    height: 220,
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '0 20px',
    flexDirection: 'column',
    marginTop: -16,
  },
  largeModal: {
    height: 270,
  },
}));
