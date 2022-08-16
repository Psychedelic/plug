import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';

import clsx from 'clsx';
import { icnsUrl } from '@shared/constants/urls';
import Button from '../../../Button';
import LinkButton from '../../../LinkButton';

import useStyles from './styles';

const ICNSModal = ({ closeModal, loading }) => {
  const classes = useStyles();
  const openICNSPage = () => {
    if (!loading) {
      extension.tabs.create({ url: icnsUrl });
    }
  };
  const { t } = useTranslation();
  return (
    <div className={clsx(classes.modal)}>
      <Typography>{t('send.icnsModalText')}</Typography>
      <Button
        variant="rainbow"
        value={t('common.okIUnderstand')}
        onClick={closeModal}
        fullWidth
        disabled={loading}
      />
      <LinkButton
        value={t('send.icnsModalLearnMore')}
        onClick={openICNSPage}
      />
    </div>
  );
};

ICNSModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ICNSModal;
