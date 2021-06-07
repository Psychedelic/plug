import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    cursor: 'pointer',
    display: 'flex',
    color: theme.palette.common.primaryBlack,
    fontSize: 12,
    fontWeight: 700,
    alignItems: 'center',
  },
  image: {
    marginLeft: 3,
  },
}));
