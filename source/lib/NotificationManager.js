import extension from 'extensionizer';

class NotificationManager {
  constructor(image) {
    this.iconUrl = image;
  }

  notificateError(message = "The last request made to Plug didn't go through") {
    this.showNotification({
      title: 'Plug - Error',
      message,
    });
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
