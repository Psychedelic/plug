import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    padding: '18px 6px',
    minHeight: 320 + 118,
  },
  title: {
    marginLeft: 18,
    marginBottom: 12,
  },
  grid: {
    display: 'grid',
    justifyContent: 'space-evenly',
    gridTemplateColumns: 'repeat(auto-fill, 112px)',
  },
  nft: {
    height: 112,
    width: 112,
    filter: 'drop-shadow(0px 2px 8px #B5B5B5)',
    borderRadius: 15,
    paddingLeft: 8,
    paddingRight: 8,
    border: '1px solid #B5B5B5',
    cursor: 'pointer',
  },
  id: {
    paddingTop: 3,
  },
  nftContainer: {
    paddingTop: 6,
    paddingBottom: 6,
  },
});
