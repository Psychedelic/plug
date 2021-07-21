import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { AppItem } from '@ui';
import DeleteImg from '@assets/icons/delete.svg';
import ThinkingEmoji from '@assets/icons/thinking-emoji.svg';
import { useApps } from '@hooks';
import ActionDialog from '../ActionDialog';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const Apps = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { parsedApps: apps, removeApp } = useApps();
  const [open, setOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleRemoveApp = (app) => {
    removeApp(app.url);
    setOpen(false);
  };

  const handleOpenDialog = (app) => {
    setSelectedApp(app);
    setOpen(true);
  };

  if (!apps.length) {
    return (
      <div className={classes.emptyState}>
        <img src={ThinkingEmoji} className={classes.image} />
        <Typography className={classes.emptyTitle} variant="h4">{t('apps.emptyTitle')}</Typography>
        <Typography className={classes.emptyText} variant="subtitle2">{t('apps.emptyText')}</Typography>
      </div>
    );
  }

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
                {apps.map((app, index) => (
                  <AppItem
                    key={index.toString()}
                    onClick={() => handleOpenDialog(app)}
                    deleteIcon={DeleteImg}
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
            onClick={() => handleRemoveApp(selectedApp)}
            onClose={() => setOpen(false)}
          />
        )
      }
    </>
  );
};

export default Apps;
