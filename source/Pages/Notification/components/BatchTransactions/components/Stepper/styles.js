import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  stepper: {
    width: '100%',
    height: 40,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
  },
  stepperActive: {
    background: theme.palette.primary.mainGradient,
  },
  stepperInactive: {
    background: '#B5B7BB',
  },
  arrow: {
    fontWeight: 500,
    color: '#FFFFFF',
    cursor: 'pointer',
    position: 'absolute',
  },
  requestCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    width: 'fit-content',
  },
  left: {
    left: theme.spacing(2),
  },
  right: {
    right: theme.spacing(2),
  },
}));
