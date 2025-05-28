export interface User {
  id: string;
  userIdx: number;
  userName: string;
  userGender: string;
  userCell: string;
  userAddress: string;
  userEmail: string;
  userBirth: string;
  joinDate: string;
  hqIdx: number;
  teamIdx: number;
  gradeIdx: number;
  hqName: string;
  teamName: string;
  gradeName: string;
  adminRole: string;
  adminGradeIdx: number | null;
  comment: string;
  userPersonalEmail: string | null;
  accountNumber: string | null;
  accountBank: string | null;
  passportName: string | null;
  passportBirth: string | null;
  passportNo: string | null;
  passportExpiry: string | null;
  probationPeriod: string | null;
  userAvail: string;
}

export interface UserOption {
  label: string;
  value: string;
}
