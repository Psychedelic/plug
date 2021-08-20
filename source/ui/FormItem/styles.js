import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    width: '100%',
  },
  label: {
    fontWeight: 700,
    textAlign: 'left',
  },
  componentContainer: {
    marginTop: theme.spacing(0.5),
  },
  subtitleContainer: {
    marginTop: theme.spacing(0.5),
  },
  smallLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '16.8px',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  endIcon: {
    marginLeft: 'auto',
  },
}));
