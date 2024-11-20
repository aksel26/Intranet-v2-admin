export interface TQna {
  qnaIdx: number;
  userIdx: number;
  userName: string;
  userCell: string;
  category: string;
  text: string | null;
  replySuccessYN: string;
  replyText: null | string;
  replyAdmin: null | string;
  createdAt: string;
  gradeName: string;
}
