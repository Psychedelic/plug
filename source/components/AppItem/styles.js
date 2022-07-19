import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    color: '#111827',
    opacity: 0,
    transition: 'opacity .6s',
  },
  title: {
    marginLeft: theme.spacing(1),
    width: 240,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  firstIcon: {
    marginLeft: 'auto',
  },
  visible: {
    opacity: 1,
  },
}));
