import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  badge: {
    borderRadius: 6,
    width: 'fit-content',
    padding: '2px 8px',
    background: '#F3F5F9',
    color: '#6B7280',
  },
  primaryBadge: {
    background: '#D3E1FF',
    color: '#3574F4',
  },
  infoIcon: {
    margin: 3,
    cursor: 'pointer',
  },
  addressTranslationContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    padding: '12px 10px 12px 0px',
    maxHeight: 130,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  addressRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  relative: {
    position: 'relative',
  },
  secondaryAddressRow: {
    paddingTop: 13,
  },
}));
