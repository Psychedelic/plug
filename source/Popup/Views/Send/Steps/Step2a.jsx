import React from 'react';
import {
  Container, LinkButton, SelectButton, Button,
} from '@ui';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import InfoImg from '@assets/icons/info.svg';
import DankImg from '@assets/icons/dank.svg';
import CanisterImg from '@assets/icons/canister.svg';

const dank = 'dank';
const canister = 'canister';

const Step2a = ({ destination, handleChangeDestination, handleChangeStep }) => {
  const { t } = useTranslation();

  const buttons = [
    {
      key: 'dank-btn',
      startImage: DankImg,
      value: t('send.keepDank'),
      endImage: InfoImg,
      selected: destination === dank,
      onClick: () => handleChangeDestination(dank),
    },
    {
      key: 'withdraw-btn',
      startImage: CanisterImg,
      value: t('send.withdrawCanister'),
      endImage: InfoImg,
      selected: destination === canister,
      onClick: () => handleChangeDestination(canister),
    },
  ];

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{t('send.canisterDetected')}</Typography>
        </Grid>
        {
          buttons.map((item) => (
            <Grid item xs={12} key={item.key}>
              <SelectButton {...item} />
            </Grid>
          ))
        }
        <Grid item xs={12}>
          <LinkButton value={t('send.help')} onClick={() => null} />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="rainbow" value={t('common.continue')} onClick={handleChangeStep} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2a;

Step2a.propTypes = {
  destination: PropTypes.string.isRequired,
  handleChangeDestination: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
};
