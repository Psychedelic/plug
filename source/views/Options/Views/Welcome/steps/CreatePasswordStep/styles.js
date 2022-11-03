import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  createPasswordContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    maxWidth: 600,
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  passwordError: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    '& > img': {
      marginRight: '1rem',
    },
  },
}));
