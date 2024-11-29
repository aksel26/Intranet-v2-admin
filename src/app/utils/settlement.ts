export const settlementStatus = (status: string) => {
  switch (status) {
    case "not_yet":
      return "미정산";
    default:
      return "정산";
  }
};
