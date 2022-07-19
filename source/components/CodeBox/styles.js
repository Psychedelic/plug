import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    borderRadius: '10px',
    padding: '12px 16px',
    background: theme.palette.common.primaryBlack,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleDecorations: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& div': {
      width: '11px',
      height: '11px',
      borderRadius: '100%',
      marginRight: '6px',
    },
  },
  redDecoration: {
    backgroundColor: '#FF5F56',
  },
  yellowDecoration: {
    backgroundColor: '#FFBD2E',
  },
  greenDecoration: {
    backgroundColor: '#27C93F',
  },
  copyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: '#367FF8',
    cursor: 'pointer',
  },
  copyIcon: {
    fontSize: '14px',
    marginRight: '6px',
  },
  copyText: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
  },
  codeContainer: {
    fontWeight: 700,
    fontSize: '13px',
    lineHeight: '20px',
    color: '#FFFFFF',
    marginTop: '12px',
    whiteSpace: 'pre-line',
  },
  '@keyframes copied': {
    '0% 100%': {
      color: '#367FF8',
      transform: 'scale(1)',
    },
    '50%': {
      color: 'white',
      transform: 'scale(1.1)',
    },
  },
  copiedAnimation: {
    animationName: '$copied',
    animationDuration: '0.5s',
  },
}));
