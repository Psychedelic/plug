import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: 'fit-content',
    padding: '10px 12px',
    borderRadius: 10,
    background: '#F3F4F6',
    display: 'flex',
    flexDirection: 'column',
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
    minHeight: 52,
  },
  name: {
    color: '#6B7280',
    fontWeight: 500,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    color: '#000000',
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    objectFit: 'cover',
  },
  iconContainer: {
    background: 'white',
    overflow: 'hidden',
    width: 34,
    height: 34,
    borderRadius: 31,
    marginRight: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
