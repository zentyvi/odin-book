import moment from "moment";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider.jsx";

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
  number = Number(number);
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

export function getRandomNumberFromString(string, max = 5) {
  let r = string.split("").reduce((a, r) => {
    return r.charCodeAt();
  }, 0);
  return (r % max) + 1;
}

export function getMyLocalSettings() {
  const settings = JSON.parse(localStorage.getItem("settings"));
  return settings || {};
}

export function updateLocalSettings(newSettings) {
  if (typeof newSettings !== "object") {
    throw new Error(
      `Settings to update must be object, recived: ${typeof newSettings}`,
    );
  }
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  localStorage.setItem(
    "settings",
    JSON.stringify({ ...settings, ...newSettings }),
  );
}

export const mergeData = (oldData, newData) => {
  if (!Array.isArray(oldData) || !Array.isArray(newData)) {
    throw new Error(
      `Both arguments must be arrays, recived: ${typeof oldData} and ${typeof newData}.`,
    );
  }
  const dataMap = new Map();

  oldData.forEach((oldItem) => dataMap.set(oldItem.id, oldItem));

  newData.forEach((newItem) => {
    const existing = dataMap.get(newItem.id);

    if (existing) {
      dataMap.set(newItem.id, { ...existing, ...newItem });
    } else {
      dataMap.set(newItem.id, newItem);
    }
  });

  return Array.from(dataMap.values());
};

export const filterData = (array, id) => {
  if (!Array.isArray(array)) {
    throw new Error(`Array to filter is ${typeof array}, must be Array`);
  }

  return array.filter((i) => i?.id !== id);
};

export const useTitle = (title) => {
  const { user } = useAuth();
  const receivedRequestsNumber = user?.receivedRequests?.length;
  const notifications =
    receivedRequestsNumber > 0 ? `(${receivedRequestsNumber}) ` : "";
  useEffect(() => {
    document.title = `${notifications}${title} | Odin blog`;
  }, [title, notifications]);
};
