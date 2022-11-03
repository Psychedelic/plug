import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  seedPhraseStepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  seedPhraseContainer: {
    height: 185,
    position: 'relative',
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
}));
