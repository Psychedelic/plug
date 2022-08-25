import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  nftDisplayContainer: {
    height: 135,
    borderRadius: 12,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    padding: 15,
    width: '90%',
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
    marginRight: 20,
  },
}));
