import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { useContacts } from '@hooks';
import { ActionDialog, IDInput } from '@components';
import EMOJIS from '@shared/constants/emojis';
import {
  FormItem, MultiInput, Container, Button, Dialog, Alert, TextInput,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import useStyles from '../styles';

const Step1 = ({
  amount,
  handleChangeAmount,
  handleChangeStep,
  assets,
  selectedAsset,
  availableAmount,
  primaryValue,
  secondaryValue,
  conversionPrice,
  handleSwapValues,
  handleChangeAsset,
  address,
  handleChangeAddress,
  addressInfo,
  handleChangeAddressInfo,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openAssets, setOpenAssets] = useState(false);
  const [openAddContact, setOpenAddContact] = useState(false);
  const [contactName, setContactName] = useState('');

  const [selectedContact, setSelectedContact] = useState(null);

  const handleSelectedContact = (contact) => setSelectedContact(contact);

  const { principalId, accountId } = useSelector((state) => state.wallet);

  const { contacts, handleAddContact, handleRemoveContact } = useContacts();

  const isUserAddress = [principalId, accountId].includes(address);

  const addContact = () => {
    const contact = {
      name: contactName,
      id: address,
      image: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
    handleAddContact(contact);
    setSelectedContact(contact);
    handleChangeAddress(contact.id);
    setOpenAddContact(false);
    setContactName('');
  };

  const handleChangeContactName = (e) => {
    setContactName(e.target.value);
  };

  const handleCloseAssets = (value) => {
    setOpenAssets(false);
    handleChangeAsset(value);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t('send.asset')}
            component={(
              <MultiInput
                name={selectedAsset.name}
                image={selectedAsset.image}
                onClick={() => setOpenAssets(true)}
                value={amount}
                onChange={handleChangeAmount}
                primaryValue={primaryValue}
                secondaryValue={secondaryValue}
                conversionPrice={conversionPrice}
                handleSwapValues={handleSwapValues}
                availableAmount={availableAmount.amount}
                decimalScale={5}
              />
            )}
            subtitle={(
              <div className={classes.subtitle}>
                <Typography variant="subtitle2" className={classes.pre}>
                  <NumberFormat
                    value={availableAmount.amount}
                    decimalScale={5}
                    fixedDecimalScale
                    thousandSeparator=","
                    displayType="text"
                    prefix={availableAmount.prefix}
                    suffix={availableAmount.suffix}
                  />
              &nbsp;
                  {t('send.available')}
                </Typography>
                <Button
                  variant="primaryOutlined"
                  value={t('common.max')}
                  onClick={() => handleChangeAmount(availableAmount.amount)}
                />
              </div>
            )}
          />

          <Dialog
            title={t('send.selectAsset')}
            items={assets}
            onClose={handleCloseAssets}
            selectedValue={selectedAsset}
            open={openAssets}
          />

        </Grid>
        <Grid item xs={12}>
          <FormItem
            label={t('send.to')}
            component={(
              <IDInput
                value={address}
                onChange={handleChangeAddress}
                addressInfo={addressInfo}
                handleChangeAddressInfo={handleChangeAddressInfo}
                contacts={contacts}
                handleRemoveContact={handleRemoveContact}
                selectedContact={selectedContact}
                handleSelectedContact={handleSelectedContact}
                selectedAsset={selectedAsset}
              />
            )}
          />
        </Grid>
        {
          addressInfo.type === 'account id' && selectedAsset.id === 'CYCLES'
          && (
            <Grid item xs={12}>
              <div className={classes.appearAnimation}>
                <Alert
                  type="danger"
                  endIcon
                  title={t('send.accountWarning')}
                />
              </div>
            </Grid>
          )
        }
        {
          isUserAddress
          && <span className={classes.sameAddressFromTo}>{t('deposit.sameAddressFromTo')}</span>
        }
        {
          (address !== ''
            && addressInfo.isValid
            && !contacts.flatMap((c) => c.contacts).map((c) => c.id).includes(address))
            && !isUserAddress
          && (
            <Grid item xs={12}>
              <div className={clsx(classes.newAddress, classes.appearAnimation)}>
                <span className={classes.newAddressTitle}>{t('contacts.newAddress')}</span>
                <Button
                  variant="primary"
                  value={t('contacts.addContact')}
                  onClick={() => setOpenAddContact(true)}
                  style={{
                    minWidth: 118,
                    height: 27,
                    borderRadius: 6,
                  }}
                />
                {
                  openAddContact
                  && (
                    <ActionDialog
                      open={openAddContact}
                      title={t('contacts.addToContacts')}
                      content={(
                        <FormItem
                          label={t('contacts.name')}
                          component={(
                            <TextInput
                              fullWidth
                              value={contactName}
                              onChange={handleChangeContactName}
                              type="text"
                            />
                          )}
                        />
                      )}
                      button={t('common.add')}
                      buttonVariant="rainbow"
                      onClick={() => addContact()}
                      onClose={() => setOpenAddContact(false)}
                    />
                  )
                }
              </div>
            </Grid>
          )
        }
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            fullWidth
            disabled={
              !(amount > 0)
              || !addressInfo.isValid
              || address === null
              || address === ''
            }
            onClick={handleChangeStep}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;

Step1.propTypes = {
  amount: PropTypes.number.isRequired,
  handleChangeAmount: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
  selectedAsset: PropTypes.objectOf(PropTypes.object).isRequired,
  availableAmount: PropTypes.objectOf(PropTypes.object).isRequired,
  primaryValue: PropTypes.objectOf(PropTypes.object).isRequired,
  secondaryValue: PropTypes.objectOf(PropTypes.object).isRequired,
  conversionPrice: PropTypes.number.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  handleChangeAsset: PropTypes.func.isRequired,
  assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  address: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeAddress: PropTypes.func.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeAddressInfo: PropTypes.func.isRequired,
};
