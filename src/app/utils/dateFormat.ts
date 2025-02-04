import dayjs from "dayjs";

export const dateFormatYYYYMMDD = (date: string | null) => {
  if (!date) return "-";
  return dayjs(date).format("YYYY-MM-DD");
};

export const dateFormatTime = (date: string | null) => {
  if (!date) return "-";
  else return dayjs(date).format("HH:mm:ss");
};

export const dateFormatFull = (date: string | null) => {
  if (!date) return;
  else return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
