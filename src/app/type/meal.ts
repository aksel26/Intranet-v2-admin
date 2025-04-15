export interface TMealSettlement {
  mealStatsIdx: number;
  userIdx: number;
  userName: string;
  gradeName: string;
  mealBudget: number;
  teamName: string;
  mealExpense: number;
  mealBalance: number;
  mealOverpay: number;
  totalOverpay: number;
  breakfastExpense: number;
  dinnerExpense: number;
  breakfastOverpay: number;
  dinnerOverpay: number;
  workdays: number;
  holidays: number;
  timeoffDays: number;
  holidayWorkdays: number;
  note: string;
  clearStatus: string;
}
