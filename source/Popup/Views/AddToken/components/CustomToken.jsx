import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Button, FormItem, TextInput, Container,
} from '@ui';
import { validatePrincipalId } from '@shared/utils/ids';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const CustomToken = ({ handleChangeSelectedToken }) => {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [invalidToken, setInvalidToken] = useState(false);

  const handleChangeToken = (e) => {
    setToken(e.target.value.trim());
  };

  useEffect(() => {
    setInvalidToken(token.length > 27 || !validatePrincipalId(token)); // token validation here
  }, [token]);

  const handleSubmit = () => {
    sendMessage({ type: HANDLER_TYPES.GET_TOKEN_INFO, params: token }, async (tokenInfo) => {
      handleChangeSelectedToken(tokenInfo)();
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            smallLabel
            label={t('addToken.tokenCanisterId')}
            component={(
              <TextInput
                fullWidth
                value={token}
                onChange={handleChangeToken}
                type="text"
                error={invalidToken}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            onClick={handleSubmit}
            fullWidth
            disabled={!token || invalidToken}
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
