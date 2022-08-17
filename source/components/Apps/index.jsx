import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import ThinkingEmoji from '@assets/icons/thinking-emoji.svg';
import { useApps } from '@hooks';
import ActionDialog from '../ActionDialog';
import AppItem from '../AppItem';
import Dialog from '../Dialog';
import CanisterInfoContainer from '../CanisterInfo/components/Container';
import CanisterInfoItem from '../CanisterInfo/components/Item';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const Apps = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { parsedApps: apps, removeApp } = useApps();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [canistersInfo, setCanistersInfo] = useState([]);

  const handleRemoveApp = (app) => {
    removeApp(app.url);
    setOpenDelete(false);
  };

  const handleOpenDelete = (app) => () => {
    setSelectedApp(app);
    setOpenDelete(true);
  };

  const handleOpenDetail = (app) => () => {
    setCanistersInfo(app?.whitelist ? Object.values(app.whitelist) : []);
    setOpenDetail(true);
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
                </div>
                {apps.map((app, index) => (
                  <AppItem
                    key={`${index.toString()}-${app.name}`}
                    onDelete={handleOpenDelete(app)}
                    onDetail={handleOpenDetail(app)}
                    {...app}
                  />
                ))}
              </>
            )
            : <EmptyState />
        }
      </div>
      {
        openDelete
        && (
          <ActionDialog
            open={openDelete}
            title={t('apps.disconnectTitle')}
            content={<Typography>{t('apps.disconnectText')} <b>{selectedApp.name}</b>?</Typography>}
            confirmText={t('common.disconnect')}
            buttonVariant="danger"
            onClick={() => handleRemoveApp(selectedApp)}
            onClose={() => setOpenDelete(false)}
          />
        )
      }
      {
        openDetail
        && (
          <Dialog
            title={t('apps.whitelistTitle')}
            onClose={() => setOpenDetail(false)}
            open={openDetail}
            component={(
              <CanisterInfoContainer className={classes.canisterInfoContainer}>
                {canistersInfo.map(
                  (canister) => (<CanisterInfoItem key={canister.id} canister={canister} />),
                )}
              </CanisterInfoContainer>
            )}
          />
        )
      }
    </>
  );
};

export default Apps;
