import moment from "moment";

export function getFullName(user) {
  return user ? `${user.firstName} ${user.lastName || ""}`.trim() : "User";
}

export function getCalendarTime(date, is24h = true) {
  const timeFormat = is24h ? "HH:mm" : "hh:mm A";

  const calendarConfig = {
    sameDay: `[Today at] ${timeFormat}`,
    nextDay: `[Tomorrow at] ${timeFormat}`,
    nextWeek: `dddd [at] ${timeFormat}`,
    lastDay: `[Yesterday at] ${timeFormat}`,
    lastWeek: `[Last] dddd [at] ${timeFormat}`,
    sameElse: "L",
  };

  return moment(date).calendar(null, calendarConfig);
}

export function formatNumber(number) {
  let formatedNumber = number;
  if (number > 1_000_000) {
    formatedNumber = `${(number / 1_000_000).toFixed(1)}M`;
  } else if (number > 1000 && number < 1_000_000) {
    formatedNumber = `${(number / 1000).toFixed(1)}K`;
  }

  return formatedNumber;
}
