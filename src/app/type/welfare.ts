export interface TWelfares {
  welfareIdx: number;
  userIdx: number;
  userName: string;
  gradeName: string;
  targetDay: string;
  content: string;
  amount: null | number;
  payerName: string;
  confirmYN: string;
  confirmDate: null | string;
}

export interface TWelfareSettlement {
  welfareStatsIdx: number;
  year: string;
  halfYear: string;
  userIdx: number;
  userName: string;
  gradeName: string;
  welfareBudget: number;
  welfareExpense: number;
  welfareBalance: number;
  note: string;
  clearStatus: string;
  teamName: string;
}

export interface TActivitesSettlement {
  activityStatsIdx: number;
  year: string;
  halfYear: string;
  userIdx: number;
  userName: string;
  gradeName: string;
  activityBudget: number;
  activityExpense: number;
  activityBalance: number;
  note: string;
  clearStatus: string;
}
