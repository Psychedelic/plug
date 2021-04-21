import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  number: {
    color: theme.palette.common.blue,
    fontWeight: 500,
    fontSize: 16,
    paddingRight: theme.spacing(0.5),
    textAlign: 'right',
    width: 24,
    display: 'inline-block',
  },
  text: {
    color: theme.palette.common.primaryBlack,
    fontWeight: 600,
    fontSize: 14,
    display: 'inline-block',
    textAlign: 'left',
    width: 60,
  },
}));
