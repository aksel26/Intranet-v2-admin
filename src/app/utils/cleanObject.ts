import dayjs from "dayjs";

export const cleanObject = (obj: any, key: string) => {
  // Create a copy of the object to avoid mutating the original
  const cleanedObj = { ...obj };

  if (cleanedObj.sDate === "Invalid Date") {
    cleanedObj.sDate = dayjs().startOf("month").format("YYYY-MM-DD");
  }
  if (cleanedObj.eDate === "Invalid Date") {
    cleanedObj.eDate = dayjs().endOf("month").format("YYYY-MM-DD");
  }

  // Remove keys with empty string values
  Object.keys(cleanedObj).forEach((key) => {
    if (cleanedObj[key] === "" || cleanedObj[key] === null) {
      delete cleanedObj[key];
    }
  });
  // Convert gradeIdx to number if it exists
  if (key in cleanedObj) {
    cleanedObj[key] = Number(cleanedObj[key]);
  }

  return cleanedObj;
};
