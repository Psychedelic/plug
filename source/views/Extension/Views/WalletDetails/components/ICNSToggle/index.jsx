import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';

import ICNS_IMG from '@assets/icons/icns.svg';
import { Switch, Button, InfoModal } from '@components';

import useStyles from './styles';
import ICNSSelector from '../ICNSSelector';

const ICNSToggle = ({
  active,
  handleToggle,
  names,
  resolved,
  loading,
  handleSetReverseResolution,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <div className={clsx(
        classes.icnsContainer,
        active && classes.active,
      )}
      >
        <div className={classes.toggleContainer}>
          <div className={classes.titleContainer}>
            <img
              className={classes.icnsImg}
              src={ICNS_IMG}
            />
            <Info
              className={classes.info}
              size={20}
              onClick={() => setInfoOpen(true)}
              data-testid="info-icns-icon-button"
            />
          </div>
          <Switch
            checked={active}
            onChange={handleToggle}
            data-testid="icns-switch"
          />
        </div>
        {active && (
          <>
            <ICNSSelector
              names={names}
              resolved={resolved}
              loading={loading}
              handleSetReverseResolution={handleSetReverseResolution}
            />
            {!names?.length && !loading && (
              <Button
                onClick={() => extension.tabs.create({ url: 'https://icns.id' })}
                value={t('walletDetails.getICNS')}
                fullWidth
                variant="blue"
                wrapperStyle={{ textAlign: 'center' }}
              />
            )}
          </>
        )}
      </div>
      <InfoModal
        title={t('walletDetails.icnsInfoTitle')}
        onClose={() => setInfoOpen(false)}
        isOpen={infoOpen}
        content={t('walletDetails.icnsDescription')}
        buttonText={t('walletDetails.icnsLearnMore')}
        understandButtonTestId="understand-icns-button"
        learnMoreButtonTestId="learn-more-button"
      />
    </>
  );
};

ICNSToggle.propTypes = {
  active: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default ICNSToggle;
