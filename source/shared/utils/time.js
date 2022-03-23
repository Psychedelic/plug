import { getLastClockCheck, setLastClockCheck } from '@modules/storageManager';

const UTC_TIME_API = 'https://www.timeapi.io/api/Time/current/zone?timeZone=Africa/Abidjan';
const MAX_MS_DIFFERENCE = 300000;

export const isClockInSync = () => {

  return fetch(UTC_TIME_API)
  .then((res) => res.json())
  .then((data) => {
    const apiTime = Date.parse(`${data.dateTime}Z`);
    const localTime = Date.parse(new Date().toUTCString());
    const inValidRange = Math.abs(apiTime - localTime) <=  MAX_MS_DIFFERENCE;
    if (!inValidRange){
      return(inValidRange);
    } 
    setLastClockCheck(); 
    return(inValidRange);
  })
  .catch(() => true);
};
