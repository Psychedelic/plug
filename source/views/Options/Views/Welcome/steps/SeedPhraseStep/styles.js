import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  seedphraseStepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 545,
  },
  seedPhraseContainer: {
    height: 185,
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  checkbox: {
    marginBottom: theme.spacing(2),
    paddingLeft: 5,
  },
}));
