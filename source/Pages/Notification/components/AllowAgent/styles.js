import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  padTop: {
    paddingTop: 25,
  },
  arrowUpRight: {
    cursor: 'pointer',
  },
  chevron: {
    transition: 'transform .2s ease-in-out',
    marginLeft: 3,
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  expand: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 500,
  },
  expandContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    cursor: 'pointer',
  },
});
