import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    width: 'auto',
    borderRadius: 10,
    position: 'absolute',
    top: 132,
    right: theme.spacing(2),
    left: theme.spacing(2),
    margin: 0,
  },
  title: {
    color: theme.palette.common.primaryBlack,
    fontSize: 16,
    fontWeight: 600,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(0.25),
    top: theme.spacing(0.25),
    color: theme.palette.common.primaryBlack,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px 0 12px 0',
  },
}));
