import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  nftDisplayContainer: {
    height: 135,
    width: 313,
    left: 54,
    top: 196,
    borderRadius: 12,
  },
  nftInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  nftImage: {
    height: 110,
    width: 110,
    borderRadius: 5,
  },
}));
