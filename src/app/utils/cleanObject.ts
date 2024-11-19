export const cleanObject = (obj: any, key: string) => {
  // Create a copy of the object to avoid mutating the original
  const cleanedObj = { ...obj };

  // Remove keys with empty string values
  Object.keys(cleanedObj).forEach((key) => {
    if (cleanedObj[key] === "" || cleanedObj[key] === null || cleanedObj[key] === "Invalid Date") {
      delete cleanedObj[key];
    }
  });
  // Convert gradeIdx to number if it exists
  if (key in cleanedObj) {
    cleanedObj[key] = Number(cleanedObj[key]);
  }

  return cleanedObj;
};
