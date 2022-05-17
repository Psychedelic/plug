import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import extension from 'extensionizer';
import ReactJson from 'react-json-view';

import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { getICNetworkStatusUrl } from '@shared/constants/urls';

import Dialog from '../Dialog';
import PlugItem from './components/items/PlugItem';
import SwapItem from './components/items/SwapItem';
import NFTItem from './components/items/NFTItem';
import TokenItem from './components/items/TokenItem';
import useStyles from './styles';
import { getAddress } from './utils';

const openICNetworkTx = (hash) => {
  extension.tabs.create({ url: getICNetworkStatusUrl(hash) });
};

const ActivityItem = (props) => {
  const {
    type,
    symbol,
    hash,
    details,
    to,
    from,
    canisterId,
  } = props;
  const [hovering, setHovering] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();
  const handleItemClick = () => {
    if (symbol === 'ICP') {
      openICNetworkTx(hash);
    }
  };

  const [copied, setCopied] = useState(false);
  const copyText = t('copy.copyTextAddress');
  const copiedText = t('copy.copiedText');
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleClickCopy = (e) => {
    e.stopPropagation();

    /* eslint-disable no-nested-ternary */
    navigator.clipboard.writeText(
      getAddress(type, to, from, canisterId),
    );

    setCopied(true);
    setTooltipText(copiedText);

    setTimeout(() => {
      setCopied(false);
    }, 1000);

    setTimeout(() => {
      setTooltipText(copyText);
    }, 1500);
  };

  const isTransaction = ['SEND', 'RECEIVE'].includes(type) && symbol === 'ICP';

  const getComponent = () => {
    if (type === 'PLUG') {
      const { status } = props;

      return status === CONNECTION_STATUS.refused ? null : PlugItem;
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

  // If component is null should return null to avoid weird spacing
  if (Component === null) return null;

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
        copied={copied}
        onCopy={handleClickCopy}
        tooltipText={tooltipText}
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
  canisterInfo: PropTypes.objectOf(PropTypes.any()),
  type: PropTypes.number,
  canisterId: PropTypes.string,
  details: PropTypes.objectOf(PropTypes.any()),
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
