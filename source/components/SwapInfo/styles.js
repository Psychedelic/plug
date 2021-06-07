import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  assetInfo: {
    width: 170,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  arrows: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.spacing(3),
    margin: 'auto',
  },
  icon: {
    height: 41,
    width: 41,
    borderRadius: 26,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
    marginBottom: theme.spacing(0.75),
  },
  asset: {
    fontSize: 18,
    marginBottom: theme.spacing(0.1),
  },
}));
