import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  infoRow: {
    padding: '8px 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  total: {
    color: theme.palette.common.blue,
    fontWeight: 600,
    fontSize: 26,
  },
  border: {
    borderBottom: `1px solid ${theme.palette.common.lightGray}`,
  },
  spaced: {
    padding: '15px 0',
  },
  image: {
    height: 22,
    width: 22,
    borderRadius: 44,
    marginRight: 6,
  },
  valueContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
