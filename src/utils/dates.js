import moment from 'moment';
// import 'moment/locale/da';
moment.locale('da');

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
 * @returns Date format dd/mm-yyyy
 */
export const dateStringToEpoch = dateString => {
  console.log('dateString', dateString);
  const day = dateString.split('/')[0];
  const month = dateString.split('/')[1].split('-')[0];
  const year = dateString.split('/')[1].split('-')[1];
  try {
    let date = new Date(year, month, day);
    console.log('date', date);
    const millis = date.getMilliseconds();
    console.log('millis', millis);
    return millis;
  } catch (error) {
    alert('Der er sket en dato fejl');
  }
  return;
};
