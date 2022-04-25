import { makeStyles } from '@material-ui/core/styles';
import { SHADOW_1 } from '@shared/styles/shadows';

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
    width: 231,
    height: 41,
    padding: '0 12px',
    border: '1px solid #FFFFFF',
    borderRadius: 6,
    color: '#111827',
    fontWeight: 600,
    fontSize: 20,
  },
  nameEdit: {
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
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
  }
}));

