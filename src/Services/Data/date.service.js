import { DateTime } from "luxon";

export const getTodayDate = (locale = "en") => {
    const now = DateTime.now().setLocale(locale);
    return now.toLocaleString(DateTime.DATE_SHORT);
};

export const getTodayTime = (locale = "en") => {
    const now = DateTime.now().setLocale(locale);
    return now.toLocaleString(DateTime.TIME_WITH_SECONDS);
}

export const getTodayDateTime = (locale = "en") => {
    const now = DateTime.now().setLocale(locale);
    return now.toLocaleString(DateTime.DATETIME_SHORT);
};