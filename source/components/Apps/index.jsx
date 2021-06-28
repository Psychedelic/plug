import React, { useState } from 'react';
import FleekImg from '@assets/icons/Fleek.svg';
import DfinityImg from '@assets/icons/Dfinity.svg';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { AppItem } from '@ui';
import DeleteImg from '@assets/icons/delete.svg';
import WinkingEmoji from '@assets/icons/wink.png';
import ActionDialog from '../ActionDialog';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

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

  const [open, setOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleRemoveApp = (id) => {
    setApps(apps.filter((app) => app.id !== id));
    setOpen(false);
  };

  const handleOpenDialog = (app) => {
    setSelectedApp(app);
    setOpen(true);
  };

  return (
    <div className={classes.centerTextContainer}>
      <img src={WinkingEmoji} className={classes.image} />
      <Typography variant="h4" className={classes.comingSoonTitle}>
        {t('apps.comingSoonTitle')}
      </Typography>
      <Typography variant="subtitle2" className={classes.comingSoonSubtitle}>
        {t('apps.comingSoonSubtitle')}
      </Typography>
    </div>
  );

  /* eslint-disable-next-line no-unreachable */
  return (
    <>
      <div className={classes.root}>
        {
          apps && apps.length > 0
            ? (
              <>
                <div className={classes.textContainer}>
                  <Typography variant="h5">{t('apps.title')}</Typography>
                  <Typography variant="subtitle2">{t('apps.subtitle')}</Typography>
                </div>
                {apps.map((app) => (
                  <AppItem
                    onClick={() => handleOpenDialog(app)}
                    icon={DeleteImg}
                    action={t('common.delete')}
                    {...app}
                  />
                ))}
              </>
            )
            : <EmptyState />
        }
      </div>
      {
        open
        && (
          <ActionDialog
            open={open}
            title={t('apps.disconnectTitle')}
            content={<Typography>{t('apps.disconnectText')} <b>{selectedApp.name}</b>?</Typography>}
            button={t('common.disconnect')}
            buttonVariant="danger"
            onClick={() => handleRemoveApp(selectedApp.id)}
            onClose={() => setOpen(false)}
          />
        )
      }
    </>
  );
};

export default Apps;
