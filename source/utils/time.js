const UTC_TIME_API = 'https://www.timeapi.io/api/Time/current/zone?timeZone=Etc/UTC';
const MAX_MS_DIFFERENCE = 120000;

export const isClockInSync = () => fetch(UTC_TIME_API, { cache: 'no-store' })
  .then((res) => res.json())
  .then((data) => {
    const apiTime = Date.parse(`${data.dateTime}Z`);
    const localTime = Date.parse(new Date().toUTCString());
    const inValidRange = Math.abs(apiTime - localTime) <= MAX_MS_DIFFERENCE;
    return inValidRange;
  })
  .catch(() => true);

export default { isClockInSync };
