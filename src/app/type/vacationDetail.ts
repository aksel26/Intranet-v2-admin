export interface TVacationDetail {
  commuteIdx: number;
  userIdx: number;
  commuteDate: string;
  commuteDayName: string;
  leaveTypeIdx: number;
  leaveType: string;
  imageIdx: number;
  imageName: string;
  imageSize: number;
  imageUrl: string;
  annualLeaveReduceUnit: number;
  note: string;
  confirmYN: string;
  confirmDate: any;
  rejectDate: any;
  confirmPersonIdx: any;
  confirmPersonName: any;
  createdAt: string;
  updatedAt: string;
  approverInfo: ApproverInfo[];
  ccUserInfo: CcUserInfo[];
  confirmStatus: string;
  remainingAnnualLeaveQuota: number;
}

export interface ApproverInfo {
  approverIdx: number;
  approverName: string;
}

export interface CcUserInfo {
  ccUserIdx: number;
  ccUserName: string;
}

export interface LeaveSummaryRoot {
  leaveSummary: LeaveSummary;
  leaveUsageStats: LeaveUsageStats;
}

export interface LeaveSummary {
  userIdx: number;
  userName: string;
  joinDate: string;
  hqName: string;
  teamName: string;
  gradeName: string;
  year: string;
  totalReceivedAnnualLeave: number;
  totalAnnualLeaveUsage: number;
  yearsSinceJoin: number;
  oneYearAfterJoin: string;
  totalAnnualLeaveBalance: number;
  notConfirmLeaveCount: number;
  midJoinReceivedAnnualLeave: number;
}

export interface LeaveUsageStats {
  fullLeaveUsage: number;
  halfLeaveUsage: number;
  quarterLeaveUsage: number;
  specialLeaveUsage: number;
  alternativeLeaveUsage: number;
  sickLeaveUsage: number;
  trainingLeaveUsage: number;
  familyEventLeaveUsage: number;
  healthLeaveUsage: number;
  totalReceivedSpecialLeave: number;
  totalReceivedAlternativeLeave: number;
}
