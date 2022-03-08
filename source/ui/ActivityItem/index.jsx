import React, { useState } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import extension from 'extensionizer';
import ReactJson from 'react-json-view';

import { getICNetworkStatusUrl } from '@shared/constants/urls';
import { Dialog } from '@ui';

import PlugItem from './components/items/PlugItem';
import SwapItem from './components/items/SwapItem';
import NFTItem from './components/items/NFTItem';
import TokenItem from './components/items/TokenItem';
import useStyles from './styles';

const openICNetworkTx = (hash) => {
  extension.tabs.create({ url: getICNetworkStatusUrl(hash) });
};

const ActivityItem = (props) => {
  const {
    type,
    symbol,
    hash,
    details,
  } = props;
  const [hovering, setHovering] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);

  const classes = useStyles();
  const handleItemClick = () => {
    if (symbol === 'ICP') {
      openICNetworkTx(hash);
    }
  };

  const getComponent = () => {
    if (type === 'PLUG') {
      return PlugItem;
    }
    if (type === 'SWAP') {
      return SwapItem;
    }

    if (symbol === 'NFT') {
      return NFTItem;
    }

    return TokenItem;
  };
  const Component = getComponent();

  const isTransaction = ['SEND', 'RECEIVE'].includes(type) && symbol === 'ICP';
  return (
    <div
      className={clsx(classes.root, isTransaction && classes.pointer)}
      onClick={handleItemClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Component
        {...props}
        setOpenDetail={setOpenDetail}
        isTransaction={isTransaction}
        hovering={hovering}
      />
      {
      openDetail
      && (
        <Dialog
          title="Transaction Details"
          onClose={() => setOpenDetail(false)}
          open={openDetail}
          component={(
            <div className={classes.transactionDetailsContainer}>
              <ReactJson
                src={details}
                collapsed={1}
                style={{
                  backgroundColor: '#F3F4F6',
                  padding: '10px',
                  borderRadius: '10px',
                  minHeight: '185px',
                  maxHeight: '340px',
                  overflow: 'auto',
                }}
              />
            </div>
          )}
        />
      )
    }
    </div>
  );
};

export default ActivityItem;

ActivityItem.defaultProps = {
  to: null,
  from: null,
  amount: null,
  value: null,
  status: null,
  icon: null,
  type: 'PLUG',
  hash: null,
  name: null,
  canisterId: null,
  details: null,
  canisterInfo: {},
};

ActivityItem.propTypes = {
  canisterInfo: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.number,
  canisterId: PropTypes.string,
  details: PropTypes.objectOf(PropTypes.any),
  to: PropTypes.string,
  from: PropTypes.string,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.number,
  status: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  icon: PropTypes.string,
  hash: PropTypes.string,
  name: PropTypes.string,
};
