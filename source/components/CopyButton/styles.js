import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  container: {
    height: 18,
    display: 'flex',
    cursor: 'pointer',
    fontSize: 18,
    transition: 'opacity 0.3s',

    '&:hover': {
      opacity: 0.75,
    },
  },
  tooltip: {
    margin: '8px 0',
  },
  tooltipSides: {
    margin: '0 8px',
  },
  label: {
    marginLeft: 3,
  },
  black: {
    color: '#374151',
  },
  blue: {
    color: '#367FF8',
  },
});
