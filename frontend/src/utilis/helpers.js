import moment from "moment";

export function getFullName(user) {
  return user ? `${user.firstName} ${user.lastName || ""}`.trim() : "User";
}

export function getCalendarTime(date, is24h = true) {
  if (date === undefined) {
    return "N/A";
  }
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

export function capitalizeFirstLetter(val) {
  if (val?.length === 0) return "";
  return (
    String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase()
  );
}

export function getRandomNumberFromString(string) {
  let r = string.split("").reduce((a, r) => {
    return r.charCodeAt();
  }, 0);
  return (r % 5) + 1;
}

export function getMySettings() {
  const settings = JSON.parse(localStorage.getItem("settings"));
  return settings || {};
}

export function updateLocalSettings(newSettings) {
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  localStorage.setItem(
    "settings",
    JSON.stringify({ ...settings, ...newSettings }),
  );
}
