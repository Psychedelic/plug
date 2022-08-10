import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import { Button } from '@ui';
import { useRouter } from '@components/Router';

import NetworkCard from '../NetworkCard';
import useStyles from './styles';

const NetworkSelector = ({ onClose, refreshWallet }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { networks } = useSelector((state) => state.network);
  const { navigator } = useRouter();
  return (
    <>
      <div className={classes.selectorContainer}>
        <div className={classes.selectorHeader}>
          <Typography variant="h4">Networks</Typography>
          <Button
            variant="rainbowOutlined"
            value={t('common.add')}
            style={{ height: 27, minWidth: 75 }}
            onClick={() => navigator.navigate('create-network')}
          />
        </div>
        <div className={classes.networksContainer}>
          {networks?.map((network, index) => (
            <NetworkCard
              network={network}
              withDivider={index < networks.length - 1}
              onClick={refreshWallet}
            />
          ))}
        </div>
      </div>
      <div className={classes.background} onClick={onClose} />
    </>
  );
};

NetworkSelector.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshWallet: PropTypes.func.isRequired,
};

export default NetworkSelector;
