import React from 'react';
import { Typography } from '@material-ui/core';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';

import { CopyButton } from '@components';
import { FormItem } from '@ui';

import useStyles from './styles';
import InfoModal from '../InfoModal';

const DetailItem = ({ value, name, setInfoOpen, isOpen }) => {
  const classes = useStyles();
  const { t } = useTranslation();
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
      <InfoModal
        title={t(`walletDetails.${name}InfoTitle`)}
        onClose={() => setInfoOpen(false)}
        isOpen={isOpen}
        content={t(`walletDetails.${name}Description`)}
        buttonText={t(`walletDetails.${name}LearnMore`)}
      />
    </>
  )
}

export default DetailItem;
