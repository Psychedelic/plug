import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';
import SMOOTH_TRANSITION from '@shared/styles/transitions'; 

export default makeStyles((theme) => ({
  badge: {
    marginRight: 12,
    borderRadius: 6,
    width: 'fit-content',
    padding: '2px 8px',
  },
  accountBadge: {
    background: '#D3E1FF',
    color: theme.palette.common.blue,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: 370,
    height: 80,
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    boxShadow: SHADOW_1,
    marginBottom: 20,
  },
  avatarEdit: {
    background: '#F3F4F6',
    border: '1px solid #F3F4F6',
  },
  name: {
    width: 162,
    height: 41,
    padding: '0 12px',
    borderRadius: 6,
    color: '#111827',
    fontWeight: 600,
    fontSize: 20,
    marginRight: 10,
  },
  nameEdit: {
    width: 231,
    background: '#FFFFFF',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  },
  resolvedNameEdit: {
    width: 231,
  },
  icon: {
    marginLeft: 3,
    marginRight: 12,
    cursor: 'pointer',
  },
  info: {
    marginLeft: 9,
  },
  globe: {
    marginLeft: 15,
    marginRight: 9,
  },
  accountContainer: {
    width: 370,
    height: 53,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 500,
    transition: theme.transitions.create(['background', 'color']),
  },
  publicAccount: {
    background: '#E1EAFE',
    color: '#3574F4',
  },
  privateAccount: {
    background: '#F3F4F6',
    color: '#6B7280',
  },
  ids: {
    width: '100%',
    background: '#F3F4F6',
    borderRadius: 10,
    padding: '9px 85px 9px 15px',
    wordBreak: 'break-all',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  id: {
    fontSize: 14,
    color: '#000000',
  },
  viewMore: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 14,
  },
  chevron: {
    transition: 'transform .2s ease-in-out',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  idInfoIcon: {
    position: 'absolute',
    right: 15,
    cursor: 'pointer',
  },
  modal: {
    height: 220,
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '0 20px',
    flexDirection: 'column',
    marginTop: -16,
  },
  walletDetailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '16px',
    width: '112px',

    '& > button': {
      width: '40px',
      height: '40px',
      background: 'rgba(53, 116, 244, 0.08)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0px 4px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: `${SMOOTH_TRANSITION}`,

      '& > img': {
        transition: `${SMOOTH_TRANSITION}`,
      },

      '&:hover': {
        background: '#3574F4',

        '& > img': {
          filter: 'brightness(0) saturate(100) invert(1)',
        },
      },
    }
  },
}));
