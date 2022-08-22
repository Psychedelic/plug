import extension from 'extensionizer';

export class NotificationManager {
  constructor(image) {
    this.iconUrl = image;
  }

  notificateError(message = "The last request made to Plug didn't go through") {
    const popup = extension.extension.getViews({ type: 'popup' });

    if (popup.length) {
      extension.runtime.sendMessage({ errorMessage: message });
    } else {
      this.showNotification({
        title: 'Plug - Notification',
        message,
      });
    }
  }

  notificateTimeout(message = 'The last request made to Plug timed out') {
    this.showNotification({
      title: 'Plug - Request timed out',
      message,
    });
  }

  showNotification({ title, message }) {
    extension.notifications.create({
      type: 'basic',
      title,
      message,
      iconUrl: this.iconUrl,
    });
  }
}

export default NotificationManager;
