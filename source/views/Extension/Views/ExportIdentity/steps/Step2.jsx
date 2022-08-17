import React, { useState, useEffect } from 'react';
import {
  Container, Button, CodeBox, Dialog, FormItem, Select,
  UserIcon,
} from '@components';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import shortAddress from '@shared/utils/short-address';
import { useTranslation } from 'react-i18next';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
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
          download('identity.pem', state);
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
                icon={<UserIcon size="medium" icon={selectedAccount?.icon} style={{ marginRight: 12 }} />}
                name={selectedAccount?.name || ''}
                text={shortAddress(selectedAccount?.principal) || ''}
                data-testid="account-select"
                accountNameTestId="account-name"
                onClick={() => setOpenAccounts(true)}
                shadow
              />
            )}
          />
          <Dialog
            title={t('exportIdentity.selectAccount')}
            items={accounts.map((a) => ({
              ...a,
              icon: <UserIcon size="small" icon={a.icon} style={{ marginLeft: -6, marginRight: 12 }} />,
              endText: shortAddress(a.principal),
            }))}
            menuItemTestId="select-item"
            onClose={handleCloseAccounts}
            selectedValue={selectedAccount}
            open={openAccounts}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="rainbow" value={t('exportIdentity.download')} onClick={handleDownloadPemFile} fullWidth data-testid="download-button" />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: 6 }}>{t('exportIdentity.runCommand')}</Typography>
          <Typography variant="subtitle2" data-testid="subtitle">{t('exportIdentity.runCommandDescription')}</Typography>
        </Grid>

        <Grid item xs={12}>
          <CodeBox prefix="" code={`${t('exportIdentity.dfxImport')}\n${t('exportIdentity.dfxUse')}`} copyIconButtonTestId="copy-button" />
        </Grid>

      </Grid>
    </Container>
  );
};

export default Step2;
