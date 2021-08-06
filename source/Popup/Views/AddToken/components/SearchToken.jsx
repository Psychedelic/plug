import React, { useEffect, useState } from 'react';
import { Container, LinkButton, TextInput } from '@ui';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import DfinityImg from '@assets/icons/Dfinity.svg';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import VerifiedImg from '@assets/icons/verified.svg';
import PropTypes from 'prop-types';
import useStyles from '../styles';

const TOKENS = [
  {
    image: DfinityImg,
    name: 'Internet Computer',
    symbol: 'ICP',
    verified: true,
  },
  {
    image: DfinityImg,
    name: 'Cycles Token',
    symbol: 'XTC',
    verified: true,
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
  },
];

const SearchToken = ({ handleChangeSelectedToken, handleChangeTab }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [search, setSearch] = useState('');
  const [filteredTokens, setFilteredTokens] = useState([]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredTokens(
      TOKENS.filter(
        (token) => lowerSearch.includes(token.name.toLowerCase())
          || lowerSearch.includes(token.symbol.toLowerCase()),
      ),
    );
  }, [search]);

  return (
    <Container>
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
          /* eslint-disable no-nested-ternary */
          !search
            ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className={classes.centered}>{t('addToken.searchText')}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinkButton value={t('addToken.searchLink')} onClick={() => null} />
                </Grid>
              </>
            )
            : filteredTokens.length > 0
              ? (
                <Grid item xs={12}>
                  {filteredTokens.map((ft) => (
                    <div
                      className={classes.tokenItem}
                      onClick={handleChangeSelectedToken(ft)}
                    >
                      <div className={classes.tokenImage}>
                        <img src={ft.image} />
                        {
                          ft.verified
                          && <img src={VerifiedImg} className={classes.verified} />
                        }
                      </div>
                      <Typography variant="h4">{ft.name} ({ft.token})</Typography>
                    </div>
                  ))}
                </Grid>
              )
              : (
                <div className={classes.emptyResults}>
                  <span className={classes.emoji}>🤔</span>
                  <Typography variant="h5">{t('addToken.emptyResults')}</Typography>
                  <LinkButton
                    style={{ marginTop: 6 }}
                    value={t('addToken.addCustomToken')}
                    onClick={() => handleChangeTab(1)}
                  />
                </div>
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
