import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';

import clsx from 'clsx';
import { Button, LinkButton } from '@ui';
import { icIdsUrl } from '@shared/constants/urls';

import useStyles from './styles';

const TranslationModal = ({ closeModal, loading, isICP }) => {
  const classes = useStyles();
  const openTwoIdsBlog = () => {
    if (!loading) {
      extension.tabs.create({ url: icIdsUrl });
    }
  };
  const { t } = useTranslation();
  return (
    <div className={clsx(classes.modal, isICP && classes.largeModal)}>
      <Typography>{t(`send.addressTranslationText${isICP ? 'ICP' : ''}`)}</Typography>
      <Button
        variant="rainbow"
        value={t('send.addressTranslationButton1')}
        onClick={closeModal}
        fullWidth
        disabled={loading}
      />
      <LinkButton
        value={t('send.addressTranslationButton2')}
        onClick={openTwoIdsBlog}
      />
    </div>
  );
};

TranslationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isICP: PropTypes.bool.isRequired,
};

export default TranslationModal;
