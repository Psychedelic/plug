import React from 'react';
import {
  Container, LinkButton, SelectButton, Button,
} from '@ui';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import InfoImg from '@assets/icons/info.svg';
import DankImg from '@assets/icons/dank.svg';
import CanisterImg from '@assets/icons/canister.svg';
import useStyles from '../styles';

const dank = 'dank';
const canister = 'canister';

const Step2 = ({ destination, handleChangeDestination, handleChangeStep }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const buttons = [
    {
      startImage: DankImg,
      value: t('send.keepDank'),
      endImage: InfoImg,
      selected: destination === dank,
      onClick: () => handleChangeDestination(dank),
    },
    {
      startImage: CanisterImg,
      value: t('send.withdrawCanister'),
      endImage: InfoImg,
      selected: destination === canister,
      onClick: () => handleChangeDestination(canister),
    },
  ];

  return (
    <Container>
      <div className={classes.chooseDestinationContainer}>
        <Typography variant="subtitle1">{t('send.canisterDetected')}</Typography>

        {
          buttons.map((item) => (
            <SelectButton {...item} />
          ))
        }

        <LinkButton value={t('send.help')} onClick={() => null} />

        <Button variant="rainbow" value={t('common.continue')} onClick={handleChangeStep} />
      </div>

    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  destination: PropTypes.string.isRequired,
  handleChangeDestination: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
};
