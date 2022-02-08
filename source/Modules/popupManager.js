import extension from 'extensionizer';
import SIZES from '../Pages/Notification/components/Transfer/constants';
import qs from 'query-string';

const getNotificationUrl = ({
  url = 'notification.html',
  metadata,
  app,
  args,
  type,
  opts,
}) => (
  qs.stringifyUrl({
    url,
    query: {
      callId: opts.message.data.data,
      portId: opts.sender,
      metadataJson: JSON.stringify(metadata),
      argsJson: JSON.stringify({ ...args, timeout: app?.timeout }),
      type,
    },
  })
);

/*
 *
 * TODO: Do react render to get window real height
 *
 */
export const createWindow = ({
  notificationData,
  keyring,
  height,
  top = 65,
  type = 'popup',
}) => {
  const url = getNotificationUrl(notificationData);
  const defaultHeight = keyring?.isUnlocked
    ? SIZES.detailHeightSmall
    : SIZES.loginHeight;

  extension.windows.create({
    url,
    type,
    width: SIZES.width,
    height: height || defaultHeight,
    top: 65,
    left: metadata.pageWidth - SIZES.width,
  });
};
