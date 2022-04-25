import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';

import ICNS_IMG from '@assets/icons/icns.svg';
import Switch from '@components/Switch';

import useStyles from './styles';
import ICNSSelector from '../ICNSSelector';
import InfoModal from '../InfoModal';

const ICNSToggle = ({ active, handleToggle }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { names } = useSelector((state) => state.icns);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <div className={clsx(
        classes.icnsContainer,
        active && classes.active,
      )}>
        <div className={classes.toggleContainer}
        >
          <div className={classes.titleContainer}>
            <img
              className={classes.icnsImg}
              src={ICNS_IMG}
            />
            <Info
              className={classes.info}
              size={20}
              onClick={() => setInfoOpen(true)}
            />
          </div>
          <Switch
            checked={active}
            onChange={handleToggle}
          />
        </div>
        {active && !!names?.length && <ICNSSelector  />}
      </div>
      <InfoModal
        title={t('walletDetails.icnsInfoTitle')}
        onClose={() => setInfoOpen(false)}
        isOpen={infoOpen}
        content={t('walletDetails.icnsDescription')}
        buttonText={t('walletDetails.icnsLearnMore')}
      />
    </>
  )
};

export default ICNSToggle;

/**
 *       <Dialog
        title={t('walletDetails.icnsInfoTitle')}
        onClose={() => setInfoOpen(false)}
        open={infoOpen}
        component={(
          <div className={classes.modal}>
            <Typography>{t('walletDetails.icnsDescription')}</Typography>
            <Button
              variant="rainbow"
              value={t('common.okIUnderstand')}
              onClick={() => setInfoOpen(false)}
              fullWidth
            />
            <LinkButton
              value={t('walletDetails.icnsLearnMore')}
              onClick={() => extension.tabs.create({ url: icIdsUrl })}
            />
          </div>
        )}
      />
 */