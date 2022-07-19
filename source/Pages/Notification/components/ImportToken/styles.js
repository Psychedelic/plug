import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  padTop: {
    paddingTop: 35,
    height: '100%',
  },
  container: {
    justifyContent: 'space-between',
  },
  tokenImage: {
    position: 'relative',
    height: 41,
    width: 41,
    marginRight: theme.spacing(1),
  },
  confirmToken: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: `${theme.spacing(1)}px 0`,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: 'auto',
    textAlign: 'end',
  },
}));
