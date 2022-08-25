import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => ({
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  nftImage: {
    height: 42,
    width: 42,
    borderRadius: 5,
  },
  errorMessage: {
    padding: '0 12px 12px',
    color: '#DC2626',
  },
}));
