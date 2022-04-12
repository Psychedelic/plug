import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  collectionHeader: {
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    justifyContent: 'space-evenly',
    gridTemplateColumns: 'repeat(auto-fill, 112px)',
    transition: 'max-height .5s ease-in-out',
    maxHeight: 0,
    overflow: 'hidden',
  },
  expanded: {
    maxHeight: 200,
  },
  nft: {
    height: 112,
    width: 112,
    borderRadius: 15,
    cursor: 'pointer',
    boxShadow: 'rgb(37 41 46 / 20%) 0px 10px 30px',
    transition: 'all 0.125s ease 0s',

    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  collectionTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  collectionIcon: {
    width: 24,
    height: 24,
    filter: 'drop-shadow(0px 2px 8px #B5B5B5)',
    borderRadius: '50%',
    marginRight: 10,
  },
  id: {
    paddingTop: 3,
  },
  nftContainer: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  collection: {
    marginBottom: 20,
  },
  expandIcon: {
    transition: 'transform .2s ease-in-out',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
}));
