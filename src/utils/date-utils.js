

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function sse() {
  let date = new Date();
  let Y = date.getFullYear();
  let M = date.getMonth();
  let D = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return new Date(Date.UTC(Y, M, D, h, m, s));
}

function pad_date(n)  {
  if (n < 10) {
    return '0'+n;
  }
  else {
    return n + ''
  }
}

function local_time(date,ds,ts) {
  ds = (ds === undefined) ? '-' : ds;
  ts = (ts === undefined) ? ':' : ts;
  let Y = date.getFullYear();
  let M = pad_date(date.getMonth());
  let D = pad_date(date.getDate());
  let h = pad_date(date.getHours());
  let m = pad_date(date.getMinutes());
  let s = pad_date(date.getSeconds());
  let res = Y + ds + M + ds + D + ' ' + h + ts + m + ts + s;
  return res;
}

function ymd(sep,date) {
  let dt = date;
  if (dt === undefined) {
    dt = new Date()
  }
  if (typeof(dt) === "string") {
    dt = new Date(date);
  }
  let s = sep;
  if (s === undefined) {
    s = ''
  }
  let Y = dt.getFullYear();
  let M = dt.getMonth() + 1;
  let D = dt.getDate();
  if (M < 10) {
    M = '0'+M
  }
  if (D < 10) {
    D = '0'+D
  }
  let res = Y + s + M + s + D;
  return res;
}

function hns(sep,date) {
  let dt = date;
  if (dt === undefined) {
    dt = new Date()
  }
  if (typeof(dt) === "string") {
    dt = new Date(date);
  }
  let s = sep;
  if (s === undefined) {
    s = ''
  }
  let H = dt.getHours();
  let N = dt.getMinutes();
  let S = dt.getSeconds();
  if (H < 10) {
    H = '0'+H
  }
  if (N < 10) {
    N = '0'+N
  }
  if (S < 10) {
    S = '0'+S
  }
  let res = H + s + N + s + S;
  return res;
}


function is_leap_year(year) {
  let y = (year === undefined) ? new Date().getFullYear() : year;
  return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
}

function inc_seconds(secs,date) {
  let dt = (date === undefined) ? new Date() : date;
  return new Date(dt.getTime() + ( secs * 60 * 1000));
}

function inc_minutes(mins,date) {
  let dt = (date === undefined) ? new Date() : date;
  return new Date(dt.getTime() + ( mins * 60 * 1000));
}

function inc_hours(hours,date) {
  let dt = (date === undefined) ? new Date() : date;
  return new Date(dt.getTime() + ( hours * 60 * 60 * 1000));
}

function inc_days(days,date) {
  let dt = (date === undefined) ? new Date() : date;
  return new Date(dt.getTime() + (days * 24 * 60 * 60 * 1000));
}

function inc_weeks(weeks,date) {
  let dt = (date === undefined) ? new Date() : date;
  return new Date(dt.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000));
}

function inc_months(months,date) {
  let dt = (date === undefined) ? new Date() : date;
  let currentYear        = dt.getFullYear();
  let currentMonth       = dt.getMonth();
  let currentDay         = dt.getDate();
  let currentHour        = dt.getHours();
  let currentMinute      = dt.getMinutes();
  let currentSecond      = dt.getSeconds();
  let currentMilliSecond = dt.getMilliseconds();
  let nextYear = currentYear + Math.floor( (months + currentMonth) / 12);
  let leapDays = is_leap_year(nextYear) ? 29 : 28;
  let endOfMonth = [31,leapDays,31,30,31,30,31,31,30,31,30,31];
  let nextMonth = (currentMonth + months) % 12;
  let minNextDay = Math.min(endOfMonth[nextMonth],currentDay);
  console.log('nextYear',nextYear,'nextMonth',nextMonth,'minNextDay',minNextDay);
  return new Date(nextYear,nextMonth,minNextDay,currentHour,currentMinute,currentSecond);
}

function inc_years(years,date) {
  let dt = (date === undefined) ? new Date() : date;
  let currentYear        = dt.getFullYear();
  let currentMonth       = dt.getMonth();
  let currentDay         = dt.getDate();
  let currentHour        = dt.getHours();
  let currentMinute      = dt.getMinutes();
  let currentSecond      = dt.getSeconds();
  let currentMilliSecond = dt.getMilliseconds();
  let nextYear           = currentYear + years;
  return new Date(nextYear,currentMonth,currentDay,currentHour,currentMinute,currentSecond);
}

function mmmdd(date) {
  let dateStr = ymd('-',date);
  let tokens  = dateStr.split('-');
  let month   = tokens[1] * 1 -1;
  let mmm     = MONTHS[month];
  return mmm+'-'+tokens[2];
}

function hhnn(date) {
  let dateStr = hns('-',date);
  let tokens  = dateStr.split('-');
  let hh   = tokens[0];
  let nn   = tokens[1];
  return hh+':'+nn;
}


function days_between(startDate,endDate) {
  return Math.round(((endDate.getTime() - startDate.getTime()) / 1000 / 24 / 60 / 60 )) + 1;
}

window.date              = {};
window.date.days_between = days_between;
window.date.sse          = sse;
window.date.ymd          = ymd;
window.date.local_time   = local_time;
window.date.inc_seconds  = inc_seconds;
window.date.inc_minutes  = inc_minutes;
window.date.inc_hours    = inc_hours;
window.date.inc_hours    = inc_days;
window.date.inc_days     = inc_days;
window.date.inc_weeks    = inc_weeks;
window.date.inc_months   = inc_months;
window.date.inc_years    = inc_years;
window.date.mmmdd        = mmmdd;
window.date.hhnn         = hhnn;
window.date.hns          = hns;
