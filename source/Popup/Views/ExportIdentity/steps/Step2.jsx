import React, { useState, useEffect } from 'react';
import {
  Container, Button, CodeBox, Dialog, FormItem, Select,
} from '@ui';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import shortAddress from '@shared/utils/short-address';
import { useTranslation } from 'react-i18next';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { UserIcon } from '@components';
import download from '@shared/utils/download-text';

const Step2 = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);
  const [openAccounts, setOpenAccounts] = useState(false);

  const handleCloseAccounts = (value) => {
    setOpenAccounts(false);
    setSelectedAccountNumber(value.walletNumber);
  };

  const handleDownloadPemFile = () => {
    sendMessage({ type: HANDLER_TYPES.GET_PEM_FILE, params: selectedAccountNumber },
      (state) => {
        if (state) {
          download('identity', state);
        }
      });
  };

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (state?.wallets?.length) {
          setAccounts(state.wallets);
          setSelectedAccountNumber(state.currentWalletId);
        }
      });
  }, []);

  const selectedAccount = accounts[selectedAccountNumber];

  return (
    <Container>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <FormItem
            label={t('common.account')}
            component={(
              <Select
                icon={<UserIcon size="medium" icon={selectedAccount?.icon || '👽'} style={{ marginRight: 12 }} />}
                name={selectedAccount?.name || ''}
                text={shortAddress(selectedAccount?.principal) || ''}
                onClick={() => setOpenAccounts(true)}
                shadow
              />
            )}
          />
          <Dialog
            title={t('exportIdentity.selectAccount')}
            items={accounts.map((a) => ({
              ...a,
              icon: <UserIcon size="small" icon={a.icon || '👽'} style={{ marginLeft: -6, marginRight: 12 }} />,
              endText: shortAddress(a.principal),
            }))}
            onClose={handleCloseAccounts}
            selectedValue={selectedAccount}
            open={openAccounts}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="rainbow" value={t('exportIdentity.download')} onClick={handleDownloadPemFile} fullWidth />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: 6 }}>{t('exportIdentity.runCommand')}</Typography>
          <Typography variant="subtitle2">{t('exportIdentity.runCommandDescription')}</Typography>
        </Grid>

        <Grid item xs={12}>
          <CodeBox prefix="" code={`${t('exportIdentity.dfxImport')}\n${t('exportIdentity.dfxUse')}`} />
        </Grid>

      </Grid>
    </Container>
  );
};

export default Step2;
