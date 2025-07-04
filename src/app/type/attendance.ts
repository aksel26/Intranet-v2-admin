export interface TAttendance {
  commuteIdx: number;
  userIdx: number;
  id: string;
  userName: string;
  teamName: string;
  gradeName: string;
  commuteDate: string;
  checkInTime: string;
  checkOutTime: any;
  workingMinutes: any;
  overtimeWorkingMinutes: any;
  attendance: string;
  leaveTypeIdx: number;
  leaveType: string;
  imageIdx: any;
  imageName: any;
  imageSize: any;
  imageUrl: any;
  updateReason: any;
  earlyLeaveReason: any;
  note: any;
  checkInIpAddr: string;
  checkOutIpAddr: any;
  checkInLogAgent: string;
  checkOutLogAgent: any;
  confirmYN: string;
  confirmDate: any;
  rejectDate: any;
  createdAt: string;
  updatedAt: string;
  confirmStatus: string;
  leave: any;
}
