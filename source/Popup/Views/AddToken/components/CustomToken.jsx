import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormItem,
  TextInput,
  Container,
  Alert,
  Dialog,
  Select,
} from '@components';
import { validateCanisterId } from '@shared/utils/ids';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import extension from 'extensionizer';
import { customTokensUrl } from '@shared/constants/urls';
import useStyles from '../styles';

const FUNGIBLE_STANDARDS = { DIP20: 'DIP20', EXT: 'EXT' };

const CustomToken = ({ handleChangeSelectedToken }) => {
  const { t } = useTranslation();
  const [canisterId, setCanisterId] = useState('');
  const [standard, setStandard] = useState(FUNGIBLE_STANDARDS.DIP20);
  const [invalidToken, setInvalidToken] = useState(null);
  const [tokenError, setTokenError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  const handleChangeId = (e) => {
    setCanisterId(e.target.value.trim());
    setTokenError('');
  };

  useEffect(() => {
    if (canisterId) {
      setInvalidToken(!validateCanisterId(canisterId));
    }
  }, [canisterId]);

  const handleSubmit = () => {
    setLoading(true);
    sendMessage(
      {
        type: HANDLER_TYPES.GET_TOKEN_INFO,
        params: { canisterId, standard },
      },
      async (tokenInfo) => {
        if (tokenInfo?.error) {
          setTokenError(tokenInfo?.error);
        } else {
          handleChangeSelectedToken(tokenInfo)();
        }
        setLoading(false);
      },
    );
  };
  const handleCloseDialog = (value) => {
    setStandard(value?.name ?? standard);
    setDialogOpen(false);
    setTokenError('');
  };

  const isInvalidInterfaceError = tokenError.includes('Call failed:');
  const isInvalidCanisterError = tokenError === 'The provided canister id is invalid';
  const isNFTNotSupportedError = tokenError === 'Non fungible tokens are not supported yet';

  return (
    <Container style={{ paddingTop: 24 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            smallLabel
            label={t('addToken.tokenCanisterId')}
            component={(
              <TextInput
                fullWidth
                value={canisterId}
                onChange={handleChangeId}
                type="text"
                error={invalidToken}
                data-testid="token-canister-id-input"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormItem
            smallLabel
            label={t('addToken.standard')}
            component={(
              <Select
                image=""
                name={standard}
                onClick={() => setDialogOpen(true)}
                shadow
                className={classes.select}
                data-testid="token-standard-select"
              />
            )}
          />
        </Grid>
        {dialogOpen && (
          <Dialog
            title={t('addToken.selectStandard')}
            items={Object.values(FUNGIBLE_STANDARDS).map((name) => ({ name }))}
            onClose={handleCloseDialog}
            selectedValue={standard}
            open={dialogOpen}
            menuItemTestId="standard-item"
          />
        )}
        {tokenError && (
          <Grid item xs={12}>
            <div className={classes.appearAnimation}>
              <Alert
                type="danger"
                title={(
                  <div>
                    <span data-testid="token-error">
                      {isInvalidCanisterError
                        ? t('addToken.invalidCanisterTokenError')
                        : isNFTNotSupportedError
                          ? t('addToken.nftTokenError')
                          : isInvalidInterfaceError
                            ? t('addToken.invalidInterfaceTokenError')
                            : tokenError}
                    </span>
                    {(isInvalidCanisterError
                      || isNFTNotSupportedError
                      || isInvalidInterfaceError) && (
                      <>
                        <br />
                        <span
                          className={classes.learnMore}
                          onClick={() => extension.tabs.create({ url: customTokensUrl })}
                        >
                          {t('common.learnMore')}
                        </span>
                      </>
                    )}
                  </div>
                )}
              />
            </div>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            onClick={handleSubmit}
            fullWidth
            disabled={!canisterId || invalidToken || loading}
            loading={loading}
            data-testid="continue-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomToken;

CustomToken.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
