import extension from 'extensionizer';

class NotificationManager {
  constructor(image) {
    this.iconUrl = image;
  }

  notificateError(message = "The last request made to Plug didn\'t go through") {
    this._showNotification({
      title: 'Plug - Error',
      message,
      iconUrl: this.iconUrl,
    });
  }

  notificateTimeout(message = "The last request made to Plug timed out") {
    this._showNotification({
      title: 'Plug - Request timed out',
      message,
      iconUrl: this.iconUrl,
    });
  }

  _showNotification({ title, message, iconUrl }) {
    extension.notifications.create({
      type: 'basic',
      title,
      message,
      iconUrl,
    });
  }
}

export default NotificationManager;
