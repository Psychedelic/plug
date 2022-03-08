import { getLastClockCheck, setLastClockCheck } from '@modules/storageManager';

const UTC_TIME_API = 'https://www.timeapi.io/api/Time/current/zone?timeZone=Africa/Abidjan';
const MAX_MS_DIFFERENCE = 300000;
const MAX_DAY_DIFFERENCE = 10;

export const isClockOutOfSync = () => {
  setLastClockCheck();

  return fetch(UTC_TIME_API)
    .then((res) => res.json())
    .then((data) => {
      const apiTime = Date.parse(`${data.dateTime}Z`);
      const localTime = Date.parse(new Date().toUTCString());
      const diff = Math.abs(apiTime - localTime);
      return diff >= MAX_MS_DIFFERENCE;
    })
    .catch(() => false);
}

export const isClockCheckExpired = (cb) => {
  getLastClockCheck((lastCheckedDateString) => {
    if (lastCheckedDateString?.length > 0) {
      const lastCheckedDate = Date.parse(lastCheckedDateString);
      const currentDate = Date.parse(new Date().toUTCString());
      const daysDifference = Math.abs(currentDate - lastCheckedDate) / (1000 * 3600 * 24);
      if (daysDifference <= MAX_DAY_DIFFERENCE) {
        cb(false);
        return;
      }
    }

    cb(true);
  });
}
