import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  leftContainer: {
    padding: '12px 16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    transition: 'background 0.2s',

    '&:hover': {
      background: '#F3F4F6',
    },
  },
  icon: {
    height: 41,
    width: 41,
    marginRight: theme.spacing(1),
    borderRadius: 26,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
  },
  alignRight: {
    marginLeft: theme.spacing(1),
    width: 14,
    height: 14,
  },
  rightContainer: {
    display: 'inline-flex',
    width: '100%',
    position: 'relative',
  },

  estimatedTotal: {
    position: 'absolute',
    bottom: theme.spacing(0.3),
    right: theme.spacing(0.5),
    color: theme.palette.common.gray,
    fontSize: 12,
  },

  input: {
    width: '100%',
    '& .MuiInputBase-input': {
      fontWeight: 600,
      fontSize: 18,
    },
    '& .MuiInputBase-root': {
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
        borderLeft: '1px solid #EDEFF2',
        borderRadius: 0,
      },
      '&:hover fieldset': {
        border: `1px solid ${theme.palette.common.primaryBlack}`,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      '&.Mui-focused fieldset': {
        border: `2px solid ${theme.palette.common.primaryBlack}`,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
  },
}));
