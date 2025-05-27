import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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

export const durationTime = (minutesInput: number | null) => {
  if (minutesInput === 0) return "0분";
  if (!minutesInput) return "-";
  else {
    const totalMinutes = minutesInput;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}시간 ${String(minutes).padStart(2, "0")}분`;

    return formattedTime;
  }
};
