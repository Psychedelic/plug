import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import {
  Layout,
  Header, LinkButton, TextInput, Button,
} from '@components';
import BackIcon from '@assets/icons/back.svg';
import { addNetwork } from '@redux/network';

import useStyles from './styles';
import { NETWORK_CREATION_DEFAULT_VALUES, NETWORK_CREATION_FIELDS } from './constants';

// TODO: Modify this to return corresponding error strings and field name for each error
const validateNetwork = (network, networks) => {
  const errors = {};
  Object.values(NETWORK_CREATION_FIELDS).forEach((field) => {
    const value = network[field.name];
    const error = field?.validate(value, networks);
    errors[field.name] = error;
  });
  return errors;
};

const NetworkCreation = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [values, setValues] = useState(NETWORK_CREATION_DEFAULT_VALUES);
  const [errors, setErrors] = useState({});
  const { networksLoading, networks } = useSelector((state) => state.network);

  const handleFieldChange = (field) => (event) => {
    const error = NETWORK_CREATION_FIELDS[field].validate(event.target.value, networks);
    if (!error) {
      setErrors({ ...errors, [field]: null });
    }
    setValues({ ...values, [field]: event.target.value });
  };

  // Cleanup values on close
  useEffect(() => () => {
    setValues(NETWORK_CREATION_DEFAULT_VALUES);
  }, []);

  const handleAddNetwork = () => {
    const newErrors = validateNetwork(values, networks);
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
    } else {
      dispatch(addNetwork(values));
      navigator.navigate('home');
    }
  };
  return (
    <Layout>
      <Header
        center={<Typography variant="h2">{t('network.addNetwork')}</Typography>}
        left={<LinkButton value={t('common.back')} onClick={navigator.goBack} startIcon={BackIcon} data-testid="back-button" />}
        right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} data-testid="close-button"/>}
      />
      <div className={classes.networkCreationContainer}>
        <div className={classes.networksContainer}>
          {Object.values(NETWORK_CREATION_FIELDS).map((field) => (
            <div className={classes.fieldContainer}>
              <Typography
                variant="h5"
                className={classes.label}
              >
                {`${t(`network.${field.name}`)}${field.required ? '*' : ''}`}
              </Typography>
              <TextInput
                onChange={handleFieldChange(field.name)}
                placeholder={t(`network.${field.name}Placeholder`)}
                error={errors[field.name]}
                data-testid={`network-input-${field.name}`}
              />
              {errors[field.name] && <Typography variant="body2" data-testid={`network-error-${field.name}`} color="error">{errors[field.name]}</Typography>}
            </div>
          ))}
        </div>
        <Button
          variant="rainbow"
          onClick={handleAddNetwork}
          value={t('network.addNetwork')}
          loading={networksLoading}
          disabled={networksLoading || !validateNetwork(values, networks)}
          data-testid="add-network-button"
          fullWidth
        />
      </div>
    </Layout>
  );
};

export default NetworkCreation;
