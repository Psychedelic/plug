import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  addressContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: theme.spacing(1),
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
  },
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
}));
