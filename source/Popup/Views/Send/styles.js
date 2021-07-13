import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  subtitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  asset: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
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
    alignItems: 'flex-end',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  margin: {
    marginRight: 12,
  },
  arrow: {
    padding: '6px 10px',
    marginRight: 8,
  },
  arrowUpRight: {
    cursor: 'pointer',
    position: 'absolute',
    right: -15,
  },
  to: {
    width: 38,
  },
  badge: {
    borderRadius: 6,
    width: 'fit-content',
    padding: '2px 8px',
  },
  principalBadge: {
    background: '#F3F5F9',
    color: '#6B7280',
  },
  accountBadge: {
    background: '#D3E1FF',
    color: '#3574F4',
  },
  infoIcon: {
    margin: 3,
    cursor: 'pointer',
  },
  principalText: {
    color: '#7A818E',
    paddingRight: 5,
  },
  accountText: {
    padding: 5,
    color: '#111827',
  },
  alertContainer: {
    background: '#D3E1FF',
    color: '#3574F4',
    borderRadius: 6,
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    fontWeight: 500,
  },
  alertButton: {
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  modal: {
    height: 220,
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '0 20px',
    flexDirection: 'column',
    marginTop: -16,
  },
  pre: {
    whiteSpace: 'pre',
  },
  sendingModal: {
    padding: 16,
    height: 320,
    margin: '-10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    background:
      'linear-gradient(122.45deg, rgba(255, 231, 1, 0.2) 15.68%, rgba(250, 81, 211, 0.2) 39.58%, rgba(16, 217, 237, 0.2) 63.84%, rgba(82, 255, 83, 0.2) 85.21%)',
  },
  sendModalTitle: {
    fontWeight: 'bold',
  },
  modalWarning: {
    padding: '0px 40px',
    textAlign: 'center',
  },
  sameAddressFromTo: {
    padding: '0 12px 12px',
    color: '#DC2626',
  },
}));
