export interface TActivity {
  activityIdx: number;
  gradeName: string;
  teamName: string;
  userIdx: number;
  userName: string;
  targetDay: string;
  content: string;
  amount: number;
  payerName: string;
}

export interface TActivitySettlement {
  activityStatsIdx: number;
  year: string;
  halfYear: string;
  userIdx: number;
  userName: string;
  gradeName: string;
  activityBudget: number;
  activityExpense: number;
  activityBalance: number;
  totalOverpay: number;
  note: any;
  clearStatus: string;
  teamName: string;
}
