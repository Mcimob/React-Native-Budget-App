export function dateToSqliteString(date) {
  let year = date.getFullYear().toString();
  let month = extendNumber(date.getMonth() + 1);
  let day = extendNumber(date.getDate());

  return `${year}-${month}-${day} 00:00:00`;
}

export function dateTimeToDate(date) {
  return dateToSqliteString(date).split(' ')[0];
}

export function subtractMonths(date, months) {
  let day = date.getDate();
  let month = date.getMonth() - months;
  let year = date.getFullYear();
  while (months < 0) {
    months += 12;
    year -= 1;
  }
  return new Date(year, month, day);
}

export function subtractDays(date, days) {
  const dayInMiliSeconds = 86_400_000; //Miliseconds in one day
  let out = new Date(date - days * dayInMiliSeconds);
  out.setHours(0, 0, 0);
  return out;
}

export function getCurrentMonthRange() {
  let now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();

  return [new Date(year, month, 1), now];
}

export function getCurrentWeekRange() {
  let now = new Date();
  let dayOfWeek = now.getDay();
  if (dayOfWeek == 0) { //Sunday
    return [subtractDays(now, 6), now];
  }
  return [subtractDays(now, dayOfWeek - 1), now];
}

function extendNumber(num) {
  let out = num.toString();
  if (out.length == 1) {
    out = '0' + out;
  }
  return out;
}

export function getItemById(list, id) {
  if (!list) {
    return null;
  }
  return list.filter(item => item.id == id)[0];
}
