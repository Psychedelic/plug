import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  transactionBoxContainer: {
    width: '100%',
    margin: '25px 24px 16px',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid #D1D5DB',
    boxShadow: '0px -1px 4px rgba(6, 44, 82, 0.1)',
  },
  transactionUpperBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '14px 14px 0 0',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: '16px',
  },
  transactionUpperLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '& > img': {
      borderRadius: '100%',
      width: '32px',
      height: '32px',
      marginRight: '8px',
    },

    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',

      '& > h3': {
        margin: 0,
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '20px',
      },
      '& > p': {
        margin: '4px 0 0',
        color: '#6B7280',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '20px',
      },
    }
  },
  transactionUpperRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '6px 12px 6px 8px',
    background: '#F3F4F6',
    borderRadius: '42px',

    '& > img': {
      width: '20px',
      height: '20px',
      marginRight: '4px',
    },
    '& > span': {
      color: '#6B7280',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
    }
  },
  transactionLowerBox: {
    borderRadius: '0 0 14px 14px',
    display: 'flex',
    flexDirection: 'column',
    alingItems: 'flex-start',
    paddingTop: '14px',
    width: '100%',
    
    '& > h3': {
      margin: 0,
      marginBottom: '8px',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '21px',
      display: 'flex',
      alignItems: 'center',
      color: '#111827',
    },
    '& > p': {
      margin: 0,
      overflowWrap: 'break-word',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '21px',
      color: '#6B7280',
    },
  },
  warningBoxContainer: {
    width: '100%',
    maxHeight: '48px',
    marginTop: '16px',
    padding: '15px 17px 12px 18px',
    background: '#FFFBEB',
    borderRadius: '14px',
    transition: 'max-height 200ms ease-in-out',
    overflow: 'hidden',
  },
  expandedWarningBox: {
    maxHeight: '160px',
  },
  warningIcon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  warningHeader: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  warningHeaderLeft: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '& > h3': {
      margin: 0,
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '21px',
      color: '#92400E',

      '& > span': {
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '21px',
      },
    },
  },
  chevronDown: {
    opacity: 0.6,
    width: '16px',
    height: '16px',
  },
  expandedWarningText: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '21px',
    color: '#B45309',
  }
}));
