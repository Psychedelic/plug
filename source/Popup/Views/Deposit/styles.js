import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(0.5),
  },
  textContainer: {
    textAlign: 'center',
  },
  command: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.2),
  },
  addressContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: theme.spacing(1),
  },
  icon: {
    color: '#367FF8',
    height: 18,
    fontSize: 18,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    transition: 'opacity 0.3s',

    '&:hover': {
      opacity: 0.75,
    },
  },
  iconQrCode: {
    width: 18,
    height: 18,
    marginRight: 12,
    color: '#367FF8',
  },
  orContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  or: {
    padding: theme.spacing(1),
    color: '#ACAEB3',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  line: {
    height: 1,
    borderBottom: '1px solid #D1D5DB',
    flex: 1,
  },
  badge: {
    marginRight: 12,
    borderRadius: 6,
    width: 'fit-content',
    padding: '2px 8px',
  },
  principalBadge: {
    background: '#D7FFDC',
    color: '#009612',
  },
  accountBadge: {
    background: '#D3E1FF',
    color: '#3574F4',
  },
}));
