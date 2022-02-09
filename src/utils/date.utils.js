const WEEKDAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const WEEKDAYS_FR = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

/**
 * Function used to get a clean date from the date passed in argument to use as a boundary for search on dates in Db
 * @param {Date} date - a date, set at any time of the day
 * @returns {Date} date - the same date, but set at the very beginning of the day
 */
function getCleanDateFromDate(date) {
  // console.log('--- getCleanDateFromDate - date', date);

  // get the string "yyyy-mm-dd" from date
  const strDate = date.toISOString().slice(0, 10);

  // return the date set to the beginning of the day
  return new Date(strDate);
}

/**
 * Function used to get a clean date from the date passed in argument to use as a boundary for search on dates in Db
 * @param {string} stringDate - a date as string, set at any time of the day
 * @returns {Date} date - the same date, but set at the very beginning of the day
 */
function getCleanDateFromStringDate(stringDate) {
  // console.log('--- getCleanDateFromStringDate - stringDate', stringDate);

  // get the string "yyyy-mm-dd" from date
  const strDate = stringDate.slice(0, 10);

  // return the date set to the beginning of the day
  return new Date(strDate);
}

export function getMondayBeforeOrEqual(date) {
  // console.log('--- getMondayBeforeOrEqual - date', date);

  let givenDate;
  if (typeof date === 'string') givenDate = getCleanDateFromStringDate(date);
  else if (date instanceof Date) givenDate = getCleanDateFromDate(date);
  else return -1;

  const givenDateWeekday = givenDate.getDay();
  const offset =
    (WEEKDAYS_EN.indexOf('Monday') - givenDateWeekday - WEEKDAYS_EN.length) %
    WEEKDAYS_EN.length;
  // console.log('offset', offset);

  let mondayDate = new Date(givenDate);
  mondayDate.setDate(givenDate.getDate() + offset);

  // console.log('mondayDate', mondayDate);
  return mondayDate;
}

function getSundayAfterOrEqual(date) {
  // console.log('--- getSundayAfterOrEqual - date', date);

  let givenDate;
  if (typeof date === 'string') givenDate = getCleanDateFromStringDate(date);
  else if (date instanceof Date) givenDate = getCleanDateFromDate(date);
  else return -1;

  const givenDateWeekday = givenDate.getDay();
  const offset =
    (WEEKDAYS_EN.indexOf('Sunday') - givenDateWeekday + WEEKDAYS_EN.length) %
    WEEKDAYS_EN.length;
  // console.log('offset', offset);

  let sundayDate = new Date(givenDate);
  sundayDate.setDate(givenDate.getDate() + offset);
  // finally, set it just 1ms before the day after
  sundayDate.setUTCHours(23, 59, 59, 999);

  // console.log('sundayDate', sundayDate);
  return sundayDate;
}

function getDateFilterFromMonToSun(date) {
  console.log('--- getDateFilterFromMonToSun - date', date);

  const mondayDate = getMondayBeforeOrEqual(date);
  const sundayDate = getSundayAfterOrEqual(date);

  let dateFilter = null;
  if (mondayDate !== -1 && sundayDate !== -1)
    dateFilter = { date: { $gte: mondayDate, $lt: sundayDate } };
  return dateFilter;
}

export function getWeekDates(date) {
  const weekDates = [];
  const mondayDate = getMondayBeforeOrEqual(date);
  weekDates.push(mondayDate);

  for (let i = 1; i < 7; i++) {
    let nextDate = new Date(mondayDate);
    nextDate.setDate(mondayDate.getDate() + i);
    // console.log('i, nextDate', i, nextDate);
    weekDates.push(nextDate);
  }
  console.log('weekDates', weekDates);

  return weekDates;
}

export function getNavDates(date) {
  const mondayDate = getMondayBeforeOrEqual(date);
  const navDates = { previous: null, next: null };

  let previousDate = new Date(mondayDate);
  previousDate.setDate(mondayDate.getDate() - 7);
  // console.log('i, previousDate', i, previousDate);
  navDates.previous = previousDate;

  let nextDate = new Date(mondayDate);
  nextDate.setDate(mondayDate.getDate() + 7);
  // console.log('i, nextDate', i, nextDate);
  navDates.next = nextDate;

  console.log('navDates', navDates);

  return navDates;
}
