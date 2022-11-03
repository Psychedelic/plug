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
  blur: {
    position: 'absolute',
    height: 'calc(100% - 24px)',
    width: 'calc(100% - 24px)',
    margin: 12,
    inset: 0,
    zIndex: 2,
    backdropFilter: 'blur(7px)',
    borderRadius: 10,

    '@supports ( -moz-appearance:none )': {
      background: 'white',
    },
  },
  checkbox: {
    marginBottom: theme.spacing(2),
    paddingLeft: 5,
  },
}));
