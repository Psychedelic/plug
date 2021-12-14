import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  canisterInfoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '1px 0',
    minHeight: 45,
    marginBottom: 20,

    '&:last-child': {
      marginBottom: 0,
    },
  },
  image: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '10px',
    marginRight: theme.spacing(1),
    objectFit: 'cover',
  },
  infoBox: {
    maxWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  canisterInfoIdItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: {
    marginLeft: 'auto',
  },
}));
