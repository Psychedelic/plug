import React, { useEffect, useState } from 'react';
import {
  Container, LinkButton, TextInput,
} from '@ui';
import { TokenIcon } from '@components';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import VerifiedImg from '@assets/icons/verified.svg';
import PropTypes from 'prop-types';
import useStyles from '../styles';
import DabInfo from './DabInfo';
import { getDabTokensWithBalance } from '@shared/services/DAB';
import { PoweredByDab } from '@components';
import { useSelector } from 'react-redux';

const SearchToken = ({ handleChangeSelectedToken, handleChangeTab }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [search, setSearch] = useState('');
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const { principalId } = useSelector((state) => state.wallet);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectToken = (token = {}) => {
    const { timestamp, ...cleanToken } = token;
    handleChangeSelectedToken({ token: cleanToken });
  };

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredTokens(
      tokens.filter(
        (token) => lowerSearch.includes(token.name.toLowerCase())
          || lowerSearch.includes(token.symbol.toLowerCase()),
      ),
    );
  }, [search]);

  useEffect(() => {
    const getTokens = async () => {
      const tempTokens = await getDabTokensWithBalance(principalId);
      setTokens(tempTokens);
    };
    getTokens();
  }, []);

  return (
    <Container style={{ paddingTop: 24 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput
            type="text"
            value={search}
            startIcon={(
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )}
            onChange={handleSearchChange}
            placeholder={t('addToken.searchTokens')}
            style={{ width: '100%' }}
          />
        </Grid>
        {
          !search
            ? (
              <Grid item xs={12}>
                <DabInfo />
              </Grid>
            )
            : filteredTokens.length > 0
              ? (
                <Grid item xs={12}>
                  <div className={classes.tokensContainer}>
                    <Typography variant="subtitle1" style={{ marginBottom: 12 }}>{t('addToken.searchResults')}</Typography>
                    {filteredTokens.map((ft) => (
                      <div
                        className={classes.tokenItem}
                        onClick={handleSelectToken(ft)}
                      >
                        <div className={classes.tokenImage}>
                          <TokenIcon image={ft.image} symbol={ft.symbol} />
                          {
                            ft.verified
                            && <img src={VerifiedImg} className={classes.verified} />
                          }
                        </div>
                        <Typography variant="h4">{ft.name} ({ft.symbol})</Typography>
                      </div>
                    ))}
                    <div className={classes.poweredByDab}>
                      <PoweredByDab />
                    </div>
                  </div>
                </Grid>
              )
              : (
                <Grid item xs={12}>
                  <div className={classes.emptyResults}>
                    <span className={classes.emoji}>🤔</span>
                    <Typography variant="subtitle1">{t('addToken.emptyResults')}</Typography>
                    <LinkButton
                      style={{ marginTop: 6 }}
                      value={t('addToken.addCustomToken')}
                      onClick={() => handleChangeTab(1)}
                    />
                    <div className={classes.poweredByDab}>
                      <PoweredByDab />
                    </div>
                  </div>
                </Grid>
              )
        }
      </Grid>
    </Container>
  );
};

export default SearchToken;

SearchToken.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
};
