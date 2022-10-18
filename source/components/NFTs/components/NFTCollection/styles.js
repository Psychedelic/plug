import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  collectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    justifyContent: 'space-evenly',
    gridTemplateColumns: 'repeat(auto-fill, 112px)',
    padding: '0 5px',
  },
  nft: {
    height: 112,
    width: 112,
    borderRadius: 15,
    cursor: 'pointer',
    transition: 'all 0.125s ease 0s',

    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  collectionTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    filter: 'drop-shadow(0px 2px 8px #B5B5B5)',
    marginRight: 10,
  },
  collectionIcon: {
    borderRadius: '50%',
    width: '100%',
    height: '100%',
  },
  icnsIcon: {
    height: 'auto',
    borderRadius: 0,
  },
  id: {
    paddingTop: 3,
  },
  nftContainer: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  expandIcon: {
    transition: 'transform .2s ease-in-out',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  numberArrowContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  nftQty: {
    fontWeight: 500,
  },
}));
