import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  subtitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewContainer: {
    height: 360,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
  },
  newAddress: {
    height: 51,
    width: '100%',
    borderRadius: 10,
    background: '#E1EAFE',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 ${theme.spacing(1)}px`,
  },
  newAddressTitle: {
    color: theme.palette.common.blue,
    fontWeight: 500,
    fontSize: 14,
  },
  '@keyframes appear': {
    '0%': {
      opacity: '0',
      height: 0,
    },
    '100%': {
      opacity: '1',
      height: 51,
    },
  },
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  image: {
    height: 22,
    width: 22,
    borderRadius: 44,
    marginRight: 6,
  },
  accountIdContainer: {
    padding: '15px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  addressContainer: {
    height: 58,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  flex: {
    display: 'flex',
  },
  arrow: {
    padding: '6px 10px',
  },
}));
