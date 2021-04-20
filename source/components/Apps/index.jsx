import React, { useState } from 'react';
import FleekImg from '@assets/icons/Fleek.svg';
import DfinityImg from '@assets/icons/Dfinity.svg';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { AppItem } from '@ui';
import DeleteImg from '@assets/icons/delete.svg';
import useStyles from './styles';

const APPS = [
  {
    id: 1,
    name: 'fleek.ooo',
    image: FleekImg,
  },
  {
    id: 2,
    name: 'dfinity.faucet',
    image: DfinityImg,
  },
];

const Apps = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [apps, setApps] = useState(APPS);

  const handleRemoveApp = (id) => setApps(apps.filter((app) => app.id !== id));

  return (
    <div className={classes.root}>
      <div className={classes.textContainer}>
        <Typography variant="h5">{t('apps.title')}</Typography>
        <Typography variant="subtitle2">{t('apps.subtitle')}</Typography>
      </div>
      {
        apps.map((app) => (
          <AppItem
            onClick={() => handleRemoveApp(app.id)}
            icon={DeleteImg}
            action={t('common.delete')}
            {...app}
          />
        ))
      }
    </div>
  );
};

export default Apps;
