import React, { useState } from 'react';
import {
  Container, LinkButton, SelectButton, Button, Dialog,
} from '@ui';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import XTCImg from '@assets/icons/XTC.svg';
import CyclesImg from '@assets/icons/Cycles.svg';
import XTC_OPTIONS from '../constants/xtc';
import useStyles from '../styles';

const Step2c = ({ destination, handleChangeDestination, handleChangeStep }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const buttons = [
    {
      startImage: XTCImg,
      value: t('send.sendXtc'),
      selected: destination === XTC_OPTIONS.SEND,
      onClick: () => handleChangeDestination(XTC_OPTIONS.SEND),
    },
    {
      startImage: CyclesImg,
      value: t('send.sendCycles'),
      selected: destination === XTC_OPTIONS.BURN,
      onClick: () => handleChangeDestination(XTC_OPTIONS.BURN),
    },
  ];

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{t('send.xtcCanisterDetected')}</Typography>
        </Grid>
        {
          buttons.map((item, index) => (
            <Grid item xs={12} key={index.toString()}>
              <SelectButton {...item} />
            </Grid>
          ))
        }
        <Grid item xs={12}>
          <LinkButton value={t('send.help')} onClick={() => setOpen(true)} />
        </Grid>

        <Dialog
          title={t('send.xtcModalTitle')}
          onClose={() => setOpen(false)}
          open={open}
          component={(
            <div className={classes.modal}>
              <Typography>{t('send.xtcModalText')}</Typography>
              <Button
                variant="rainbow"
                value={t('send.icpModalButton1')}
                onClick={() => setOpen(false)}
                fullWidth
              />
              <LinkButton
                value={t('send.xtcModalButton')}
                onClick={() => null}
              />
            </div>
          )}
        />

        <Grid item xs={12}>
          <Button fullWidth variant="rainbow" value={t('common.continue')} onClick={handleChangeStep} disabled={!destination} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2c;

Step2c.propTypes = {
  destination: PropTypes.string.isRequired,
  handleChangeDestination: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
};
