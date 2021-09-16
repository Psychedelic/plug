import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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
    borderRadius: 15,
    cursor: 'pointer',
    boxShadow: 'rgb(37 41 46 / 20%) 0px 10px 30px',
    transition: 'all 0.125s ease 0s',

    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  id: {
    paddingTop: 3,
  },
  nftContainer: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  collection: {
    marginBottom: 40,
  },
}));
