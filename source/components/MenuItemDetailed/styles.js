import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: 85,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    '&:before': {
      content: '""',
      position: 'absolute',
      left: 24,
      bottom: 0,
      height: 1,
      width: 372,
      borderBottom: '1px solid #E8EBEF',
    },
  },
  icon: {
    paddingBottom: theme.spacing(2),
    width: 20,
  },
  textContainer: {
    height: 60,
    paddingLeft: theme.spacing(0.75),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  chevron: {
    marginLeft: 'auto',
  },
  bold: {
    fontWeight: 600,
  },
}));
