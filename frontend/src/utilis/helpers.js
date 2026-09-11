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

export function getShortTime(date, is24h = true) {
  if (date === undefined) {
    return "N/A";
  }

  const timeFormat = is24h ? "HH:mm" : "hh:mm A";

  return moment(date).format(timeFormat);
}

export function checkIfSameDay(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  const moment1 = moment(date1);
  const moment2 = moment(date2);
  return moment1.isSame(moment2, "day");
}

export function createDateMessage(date) {
  const moment1 = moment(date);
  const moment2 = moment();
  const isSameDay = moment1.isSame(moment2, "day");
  const isSameYear = moment1.isSame(moment2, "year");

  if (isSameDay) {
    return "Today";
  }

  const format = isSameYear ? "MMMM D" : "YYYY, MMMM D";

  return moment(date).format(format);
}

export function formatNumber(number) {
  number = Number(number);
  let formatedNumber = number;
  if (number > 1_000_000) {
    formatedNumber = `${(number / 1_000_000).toFixed(1)}M`;
  } else if (number > 1000 && number < 1_000_000) {
    const k = Math.floor(number / 1000);
    const rest = number % 1000;
    formatedNumber = `${k},${rest}`;
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
      `Both arguments must be arrays, received: [${typeof oldData}, ${typeof newData}]`,
    );
  }

  const dataMap = new Map();

  oldData.forEach((oldItem) => {
    dataMap.set(oldItem.id, JSON.parse(JSON.stringify(oldItem)));
  });

  newData.forEach((newItem) => {
    const freshNewItem = JSON.parse(JSON.stringify(newItem));
    const existing = dataMap.get(freshNewItem.id);

    if (existing) {
      const mergedItem = { ...existing, ...freshNewItem };

      Object.keys(mergedItem).forEach((key) => {
        if (Array.isArray(existing[key]) && Array.isArray(freshNewItem[key])) {
          mergedItem[key] = mergeData(existing[key], freshNewItem[key]);
        }
      });

      dataMap.set(freshNewItem.id, mergedItem);
    } else {
      dataMap.set(freshNewItem.id, freshNewItem);
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
    document.title = `${notifications}${title} · Odin Book`;
  }, [title, notifications]);
};

export const getBearer = () => {
  const token = localStorage.getItem("token");
  const bearer = token ? `Bearer ${token}` : "";
  return bearer;
};

export const saveToken = (data) => {
  const { token } = data;
  localStorage.setItem("token", token);
};

export const moveItemToFront = (array, targetId) => {
  const index = array.findIndex((item) => item.id === targetId);

  if (index === -1) return [...array];
  if (index === 0) return [...array];

  const newArray = [...array];
  const [item] = newArray.splice(index, 1);
  newArray.unshift(item);

  return newArray;
};

export const useEscape = (callback) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") callback();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  });
};
