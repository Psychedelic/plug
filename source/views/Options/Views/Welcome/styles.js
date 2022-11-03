import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    padding: `${theme.spacing(4)}px 0`,
    position: 'relative',
    background:
      'linear-gradient(122.45deg, rgba(255, 231, 1, 0.2) 15.68%, rgba(250, 81, 211, 0.2) 39.58%, rgba(16, 217, 237, 0.2) 63.84%, rgba(82, 255, 83, 0.2) 85.21%)',
  },
  headerContainer: {
    height: 190,
    maxWidth: 540,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  stepContainer: {
    width: '100%',
    maxWidth: 950,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  goBack: {
    alignSelf: 'flex-start',
  },
  blur: {
    height: 'calc(100% - 24px)',
    width: 'calc(100% - 24px)',
    position: 'absolute',
    margin: 12,
    inset: 0,
    zIndex: 2,
    backdropFilter: 'blur(7px)',
    borderRadius: 10,

    '@supports ( -moz-appearance:none )': {
      background: 'white',
    },
  },
  memeContainer: {
    width: '100%',
    maxWidth: 400,
    background: 'white',
    borderRadius: 5,
    display: 'flex',
  },
  meme: {
    width: '100%',
    borderRadius: 5,
  },
}));
