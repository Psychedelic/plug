import React, { useEffect, useState } from 'react';
import Icon from '@assets/icons/plug.svg';
import { Typography } from '@material-ui/core';
import { useRouter } from '@components/Router';
import useStyles from './styles';

const nfts = [{
  id: 1671,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
},
{
  id: 1672,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1673,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1674,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1675,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1676,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1677,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1678,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
}, {
  id: 1679,
  url: '1',
  img: Icon,
  owner: 1,
  desc: 'Desacccc',
  name: 'ICPunk #10',
  properties: [
    {
      name: 'background',
      value: 'yellow',
    },
  ],
},
];

const NFTs = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>All NFTs</Typography>
      <div className={classes.grid}>
        {
          nfts?.map((nft) => (
            <div
              className={classes.nftContainer}
            >
              <img src={nft.img} className={classes.nft} />
              <Typography className={classes.id} variant="subtitle1">{nft.id}</Typography>
            </div>
          ))
        }
      </div>
    </div>

  );
};

export default NFTs;
