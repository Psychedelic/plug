import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  contact: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}px`,
    height: 80,
  },
  border: {
    borderTop: '1px solid #E5E7EB',
  },
  nameContainer: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: 41,
    width: 41,
    borderRadius: 41,
  },
  smallImage: {
    width: 29,
    height: 29,
  },
  icon: {
    cursor: 'pointer',
    fontSize: 18,
    transition: 'transform 0.3s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  deleteIcon: {
    color: '#111827',
    marginLeft: theme.spacing(1),
  },
  cancelIcon: {
    marginLeft: 'auto',
  },
  selectable: {
    cursor: 'pointer',

    '&:hover': {
      background: '#F3F4F6',
    },
  },
  cancelable: {
    padding: '0 8px 0 16px',
    height: '100%',
    width: '100%',
  },
}));
