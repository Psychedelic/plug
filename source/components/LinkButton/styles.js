import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',

    '&:hover': {
      opacity: 0.5,
    },
  },
  image: {
    height: 18,
    width: 18,
    paddingRight: theme.spacing(0.75),
  },
  text: {
    fontSize: 16,
    lineHeight: '19.2px',
    fontWeight: 500,
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
}));
