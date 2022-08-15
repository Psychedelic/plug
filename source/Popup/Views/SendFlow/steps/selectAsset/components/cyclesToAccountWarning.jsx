import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';

import { Alert } from '@components';
import useStyles from '../../../styles';

const CyclesToAccountWarning = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <div className={classes.appearAnimation}>
        <Alert
          type="danger"
          endIcon
          title={t('send.accountWarning')}
        />
      </div>
    </Grid>
  );
};

export default CyclesToAccountWarning;
