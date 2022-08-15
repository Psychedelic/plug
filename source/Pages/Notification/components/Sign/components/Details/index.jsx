import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { IncomingAction } from '@components';
import { ArrowDown } from 'react-feather';

import { getDabNfts } from '@shared/services/DAB';

import WarningBox from './components/WarningBox';
import NFTDisplay from './components/NFTDisplay';
import AssetDisplay from './components/AssetDisplay';
import CanisterInfoDisplay from './components/CanisterInfoDisplay';

import useStyles from './styles';
import { TRANSFER_METHOD_NAMES } from './constants';

const getDisplayComponent = (request, nftCanisters = []) => {
  const isTransfer = TRANSFER_METHOD_NAMES.includes(request?.methodName);
  if (!isTransfer) return CanisterInfoDisplay;
  return nftCanisters.includes(request?.canisterId) ? NFTDisplay : AssetDisplay;
};

const Details = ({
  shouldWarn, toggleModal, url, icon, requests,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const title = t(`sign.warning.action${requests?.length ? 's' : ''}`, { name: requests?.[0]?.canisterName || t('sign.warning.assetCanister') });
  const [nftCanisters, setNFTCanisters] = useState([]);

  const getNFTCanisters = async () => {
    const canisters = await getDabNfts();
    const ids = canisters?.map((canister) => canister?.principal_id?.toString());
    return ids;
  };

  useEffect(() => {
    getNFTCanisters().then((ids) => setNFTCanisters(ids));
  }, []);

  return (
    <div className={classes.detailsWrapper}>
      <IncomingAction
        url={url}
        image={icon}
        action={title}
      />
      <div className={classes.displaysContainer}>
        {requests.map((request, index) => {
          const Display = getDisplayComponent(request, nftCanisters);
          return (
            <div className={classes.displayContainer}>
              <Display
                toggleModal={toggleModal}
                request={request}
                shouldWarn={shouldWarn}
                resize={requests?.length === 1}
              />
              {index < requests.length - 1 && (
                <div className={classes.nextArrowContainer}>
                  <ArrowDown size="20" color="#3574F4" />
                </div>
              )}
              {shouldWarn && (
                <WarningBox
                  pageUrl={url}
                  canisterId={request?.canisterId}
                  name={request?.canisterName}
                />
              )}
            </div>
          );
        })}
        <div className={classes.gradient} />
      </div>
    </div>
  );
};

Details.propTypes = {
  shouldWarn: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  icon: PropTypes.string,
  requests: PropTypes.arrayOf(PropTypes.shape({
    canisterDescription: PropTypes.string,
    canisterIcon: PropTypes.string,
    canisterId: PropTypes.string,
    canisterName: PropTypes.string,
    canisterUrl: PropTypes.string,
    methodName: PropTypes.string,
  })).isRequired,
};

Details.defaultProps = {
  shouldWarn: false,
  icon: '',
};

export default Details;
