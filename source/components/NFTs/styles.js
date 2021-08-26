import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
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
  image: {
    width: 46,
    height: 46,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    textAlign: 'center',
    height: 320 + 118,
    whiteSpace: 'pre-line',
  },
  emptyText: {
    marginTop: 10,
  },
  emptyTitle: {
    marginTop: 10,
  },
}));
