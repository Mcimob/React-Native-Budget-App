export function dateToSqliteString(date) {
  let year = date.getFullYear().toString();

  let month = (date.getMonth() + 1).toString();
  if (month.length == 1) {
    month = '0' + month;
  }

  let day = date.getDate().toString();
  if (day.length == 1) {
    day = '0' + day;
  }

  return `${year}-${month}-${day} 00:00:00`;
}

export function dateTimeToDate(date) {
  return dateToSqliteString(date).split(' ')[0];
}

export function getItemById(list, id) {
  if (!list) {
    return null;
  }
  return list.filter(item => item.id == id)[0];
}
