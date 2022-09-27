import { makeStyles } from '@material-ui/core/styles';
import SMOOTH_TRANSITION from '@shared/styles/transitions';
import SHADOW_1 from '@shared/styles/shadows';

export default makeStyles(() => ({
  accountItemContainer: {
    width: '100%',
    height: '52px',
    padding: '8px 21px 8px 27px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    color: '#000000',
    transition: `${SMOOTH_TRANSITION}`,

    '&:hover': {
      background: 'linear-gradient(94.95deg, rgba(255, 231, 1, 0.12) -1.41%, rgba(250, 81, 211, 0.12) 34.12%, rgba(16, 217, 237, 0.12) 70.19%, rgba(82, 255, 83, 0.12) 101.95%)',

      '& > div:last-child': {
        opacity: '1 !important',
      },
    },
  },
  hiddenAccount: {
    color: 'rgba(0, 0, 0, 0.26)',
    opacity: 0.7,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  accountDetails: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '-3px',
  },
  accountName: {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
  },
  accountType: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',

    transition: `${SMOOTH_TRANSITION}`,
    '& > button': {
      padding: '5px',
      '& > span': {
        width: '24px',
        height: '24px',
      },
    },
  },
  disabledIcon: {
    opacity: 0.3,
  },
  removeEditModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 148,
    padding: '12px 0px 12px 0px',
    position: 'absolute',
    top: 50,
    right: 10,
    background: '#FFFFFF',
    borderRadius: 10,
    boxShadow: SHADOW_1,
    zIndex: 10000,
  },
  selector: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 4px 8px 8px',
    '&:hover': {
      background: '#F6F6F6',
      cursor: 'pointer',
    },
  },
}));

// export default makeStyles(() => ({
//   background: {
//     width: '100%',
//     height: '100vh',
//     zIndex: 5,
//     position: 'absolute',
//     top: 0,
//     right: 0,
//   },

//   selectorHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   networksContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     zIndex: 10,
//     maxHeight: 330,
//     overflow: 'auto',
//   },
// }));
