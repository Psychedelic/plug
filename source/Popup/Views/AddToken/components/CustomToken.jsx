import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Button, FormItem, TextInput, Container,
} from '@ui';
import DfinityImg from '@assets/icons/Dfinity.svg';
import { validatePrincipalId } from '@shared/utils/ids';

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
            onClick={handleChangeSelectedToken({
              image: DfinityImg,
              name: 'Internet Computer',
              token: 'ICP',
            })}
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
