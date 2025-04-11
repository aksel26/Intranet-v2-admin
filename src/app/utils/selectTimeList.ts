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
