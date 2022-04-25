import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Info } from 'react-feather';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';

import { icIdsUrl } from '@shared/constants/urls';
import { CopyButton } from '@components';
import {
  LinkButton,
  FormItem,
  Dialog,
  Button,
} from '@ui';

import useStyles from './styles';

const DetailItem = ({ value, name, setInfoOpen, isOpen }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  console.log('hello>');
  return (
    <>
      <FormItem
        label={t(`common.${name}`)}
        smallLabel
        endIcon={<CopyButton color="black" label="Copy" text={value} placement="left" />}
        component={(
          <div className={classes.ids}>
            <Typography variant="subtitle2" className={classes.id}>{value}</Typography>
            <Info
              className={classes.idInfoIcon}
              size={20}
              onClick={() => setInfoOpen(true)}
            />
          </div>
        )}
      />
      <Dialog
        title={t(`walletDetails.${name}InfoTitle`)}
        onClose={() => setInfoOpen(false)}
        open={isOpen}
        component={(
          <div className={classes.modal}>
            <Typography>{t(`walletDetails.${name}Description`)}</Typography>
            <Button
              variant="rainbow"
              value={t('common.okIUnderstand')}
              onClick={() => setInfoOpen(false)}
              fullWidth
            />
            <LinkButton
              value={t(`walletDetails.${name}LearnMore`)}
              onClick={() => extension.tabs.create({ url: icIdsUrl })}
            />
          </div>
        )}
      />
    </>
  )
}

export default DetailItem;
