export interface TWelfares {
  welfareIdx: number;
  userIdx: number;
  userName: string;
  teamName: string;
  gradeName: string;
  targetDay: string;
  content: string;
  amount: null | number;
  payerName: string;
  confirmYN: string;
  confirmDate: null | string;
  note: string;
  tempConfirmDate: null | string;
  groupTotalAmount: null | number;
  details: TWelfaresDetails;
}

export interface TWelfaresDetails extends TWelfares {
  payeeList: TWelfares[];
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
  totalOverpay: number;
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
