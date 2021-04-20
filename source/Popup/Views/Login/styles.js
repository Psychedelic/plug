import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: 505,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    background:
      'linear-gradient(122.45deg, rgba(255, 231, 1, 0.2) 15.68%, rgba(250, 81, 211, 0.2) 39.58%, rgba(16, 217, 237, 0.2) 63.84%, rgba(82, 255, 83, 0.2) 85.21%)',
    padding: theme.spacing(2),
  },
  formLabel: {
    transform: 'translate(0, 1.5px) scale(1) !important',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textContainer: {
    height: 200,
  },
  actionContainer: {
    height: 44,
  },
  formContainer: {
    height: 130,
    width: '100%',
    marginBottom: theme.spacing(2),
    justifyContent: 'space-between',
  },
}));
