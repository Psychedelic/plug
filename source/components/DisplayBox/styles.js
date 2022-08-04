import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  assetContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: '10px 0 0',
    padding: '16px',
    boxSizing: 'border-box',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
  },
  amountTitle: {
    margin: '0px 0px 10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 600,
    color: '#111827',
    fontSize: '22px',
    lineHeight: '20px',
  },
  amountDescription: {
    margin: 0,
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '20px',
    color: '#6B7280',
  },
  assetImg: {
    height: 56,
    width: 56,
    borderRadius: '100px',
  },
}));
