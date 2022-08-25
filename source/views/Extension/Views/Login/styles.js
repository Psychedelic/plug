import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    background:
      'linear-gradient(122.45deg, rgba(255, 231, 1, 0.2) 15.68%, rgba(250, 81, 211, 0.2) 39.58%, rgba(16, 217, 237, 0.2) 63.84%, rgba(82, 255, 83, 0.2) 85.21%)',
    padding: theme.spacing(2),
  },
  title: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
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
    marginTop: theme.spacing(3.5),
  },
  formContainer: {
    height: 131,
    width: '100%',
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    justifyContent: 'space-between',
  },
  actionContainer: {
    height: 44,
    marginBottom: theme.spacing(2),
  },
}));
