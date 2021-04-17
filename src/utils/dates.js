import moment from 'moment';
// import 'moment/locale/da';
moment.locale('da');
import { parse } from 'date-fns';

/**
 *
 * Converting dates from epoch milliseconds to date string format
 *
 * @param {string} epochDateString
 * @returns string
 */
export const dateEpochToDateString = (
  epochDateString = 0,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  try {
    let date = new Date(0);
    date.setUTCMilliseconds(Number(epochDateString));
    return moment(date).local().format(format);
  } catch (error) {
    alert('Der er sket en dato fejl');
  }
  return;
};

/**
 *
 * Converting dates from date to epoch milliseconds format
 *
 * TODO: Needs testing
 *
 * @param {string} epoc
 * @returns Date format Default format: d/M-y - >13/2-2015
 */
export const dateStringToEpoch = (dateString, format = 'd/M-y') => {
  let date;
  try {
    date = parse(dateString, format, new Date());
    const millis = date.getTime();
    return millis.toString();
  } catch (error) {
    alert('Der er sket en dato fejl');
  }
  return;
};
