import dayjs from "dayjs";

export const monthList = () => {
  return Array.from({ length: 12 }, (_, i) => i + 1);
};

export const yearsList = () => {
  const currentYear = new Date().getFullYear(); // 현재 연도
  const lastYear = currentYear; // 작년
  const years = [];

  for (let i = 4; i >= 0; i--) {
    years.push(lastYear - i);
  }

  return years;
};

// 현재 연도 기준 이전, 이후 3개년 반환
export const getYearRange = () => {
  const currentYear = dayjs().year();
  const yearList = [];

  // Add previous 3 years
  for (let i = 3; i > 0; i--) {
    yearList.push(currentYear - i);
  }

  // Add current year
  yearList.push(currentYear);

  // Add next 3 years
  for (let i = 1; i <= 3; i++) {
    yearList.push(currentYear + i);
  }

  return yearList;
};
