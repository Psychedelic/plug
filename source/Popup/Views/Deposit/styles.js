import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(0.5),
  },
  textContainer: {
    textAlign: 'center',
  },
  command: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.2),
  },
  addressContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: theme.spacing(1),
  },
  icon: {
    color: '#367FF8',
    height: 18,
    fontSize: 18,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    transition: 'transform 0.3s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
}));
