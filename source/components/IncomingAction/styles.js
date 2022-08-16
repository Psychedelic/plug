import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  image: {
    height: 51,
    width: 51,
    borderRadius: 12,
    background: theme.palette.common.primaryBlack,
    marginBottom: theme.spacing(1),
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: `${theme.spacing(1.5)}px`,
    textAlign: 'center',
  },
  title: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 370,
    textAlign: 'center',
    marginBottom: `${theme.spacing(0.5)}px`,
  },
}));
