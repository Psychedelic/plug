import React from 'react';
import extension from 'extensionizer';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { icIdsUrl } from '@shared/constants/urls';
import { Button, Dialog, LinkButton } from '@ui';

import useStyles from './styles';

const InfoModal = ({ title, isOpen, content, onClose, buttonText }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Dialog
      title={title}
      onClose={onClose}
      open={isOpen}
      component={(
        <div className={classes.modal}>
          <Typography>{content}</Typography>
          <Button
            variant="rainbow"
            value={t('common.okIUnderstand')}
            onClick={onClose}
            fullWidth
          />
          <LinkButton
            value={buttonText}
            onClick={() => extension.tabs.create({ url: icIdsUrl })}
          />
        </div>
      )}
    />
  )
}

export default InfoModal;
