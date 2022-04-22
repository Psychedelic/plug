import React, { useState } from 'react';
import clsx from 'clsx';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { Info, Globe } from 'react-feather';

import Switch from '@components/Switch';

const ICNSToggle = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [publicAccount, setPublicAccount] = useState(true);
  const handleChangePublicAccount = (event) => setPublicAccount(event.target.checked);

  return (
    <div className={clsx(
      classes.accountContainer,
      publicAccount ? classes.publicAccount : classes.privateAccount,
    )}
    >
      <Globe
        className={classes.globe}
        size={20}
      />
      <span>{t('walletDetails.publicAccount')}</span>
      <Info
        className={classes.info}
        size={20}
      />
      <Switch
        checked={publicAccount}
        onChange={handleChangePublicAccount}
      />
    </div>
  )
};

export default ICNSToggle;