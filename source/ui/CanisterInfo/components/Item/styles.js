import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  canisterInfoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '1px 0',
    '&:last-child > div > div': {
      borderBottom: 0,
    },
    '&:last-child > div': {
      borderBottom: 0,
    },
  },
  image: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '100%',
    marginRight: theme.spacing(1),
    objectFit: 'cover',
  },
  infoBox: {
    maxWidth: '200px',
  },
  canisterInfoIdItem: {
    borderBottom: '1px solid #e0e0e0',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: {
    marginLeft: 'auto',
  },
}));
