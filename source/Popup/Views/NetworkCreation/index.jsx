import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from '@components';
import {
  Header, LinkButton, TextInput, Button,
} from '@ui';
import BackIcon from '@assets/icons/back.svg';
import { addNetwork } from '@redux/network';
import { validateCanisterId } from '@shared/utils/ids';

import useStyles from './styles';
import { NETWORK_CREATION_DEFAULT_VALUES, NETWORK_CREATION_FIELDS } from './constants';

const validateNetwork = ({
  name,
  host,
  ledgerId,
}) => name && host && ledgerId && validateCanisterId(ledgerId);

const NetworkCreation = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [values, setValues] = useState(NETWORK_CREATION_DEFAULT_VALUES);
  const { networksLoading } = useSelector((state) => state.network);

  const handleFieldChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };

  // Cleanup values on close
  useEffect(() => () => {
    setValues(NETWORK_CREATION_DEFAULT_VALUES);
  }, []);

  const handleAddNetwork = () => {
    dispatch(addNetwork(values));
    navigator.navigate('network');
  };

  return (
    <Layout>
      <Header
        center={<Typography variant="h2">{t('network.network')}</Typography>}
        left={<LinkButton value={t('common.back')} onClick={navigator.goBack} startIcon={BackIcon} />}
        right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('tokens')} />}
      />
      <div className={classes.networkCreationContainer}>
        {NETWORK_CREATION_FIELDS.map((field) => (
          <div className={classes.fieldContainer}>
            <Typography variant="h5">{t(`network.${field}`)}</Typography>
            <TextInput onChange={handleFieldChange(field)} />
          </div>
        ))}
        <Button
          variant="rainbow"
          onClick={handleAddNetwork}
          value={t('network.addNetwork')}
          loading={networksLoading}
          disabled={networksLoading || !validateNetwork(values)}
          fullWidth
        />
      </div>
    </Layout>
  );
};

export default NetworkCreation;
