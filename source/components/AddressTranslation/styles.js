import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  to: {
    width: 38,
    marginBottom: 2,
  },
  card: {
    width: '100%',
    marginBottom: '20px',
  },
  addressTranslationContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    padding: '12px 10px 12px 0px',
    maxHeight: 130,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  arrow: {
    height: 25,
    width: 38,
  },
}));
