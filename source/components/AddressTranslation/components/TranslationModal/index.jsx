import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';

import { Button, LinkButton } from '@ui';
import { icIdsUrl } from '@shared/constants/urls';

import useStyles from './styles';

const TranslationModal = ({ closeModal, loading }) => {
  const classes = useStyles();
  const openTwoIdsBlog = () => {
    if (!loading) {
      extension.tabs.create({ url: icIdsUrl });
    }
  };
  const { t } = useTranslation();
  return (
    <div className={classes.modal}>
      <Typography>{t('send.icpModalText')}</Typography>
      <Button
        variant="rainbow"
        value={t('send.icpModalButton1')}
        onClick={closeModal}
        fullWidth
        disabled={loading}
      />
      <LinkButton
        value={t('send.icpModalButton2')}
        onClick={openTwoIdsBlog}
      />
    </div>
  );
};

TranslationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TranslationModal;
