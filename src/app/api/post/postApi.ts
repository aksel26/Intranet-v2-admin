import axios from "axios";

export const postApi = axios.create({
  baseURL: "https://test-acg-playground.insahr.co.kr",
  headers: {
    "Content-Type": "application/json",
  },
});

postApi.interceptors.request.use(
  (config) => {
    const userInfo = sessionStorage.getItem("user");
    const token = userInfo ? JSON.parse(userInfo).accessToken : null;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 어드민 로그인 API

export const adminLogin = (values: any) => postApi.post(`/login/admin`, values);

// 어드민 로그아웃 API
export const adminLogout = () => postApi.post(`/logout/admin`);

// 어드민 식대 설정 비고 수정 API
export const updateMealBudgetNote = (values: any) =>
  postApi.patch(`/admin/meals/budget/${values.mealStatsIdx}`, values.body, {
    params: { mealStatsIdx: values.mealStatsIdx },
  });

// 어드민 식대 설정 등록 및 수정 API
export const updateMealBudget = (values: any) => postApi.post(`/admin/meals/budget`, values.body);

// 직원 등록 API
export const addStaff = (values: any) => postApi.post(`/admin/users`, values);

// 직원 수정 API

export const editStaff = (values: any) =>
  postApi.put(`/admin/users/${values.params}`, values.body, {
    params: { userIdx: values.params },
  });

// 어드민 식대 정산완료 업데이트 API
export const settlement = (values: any) => postApi.patch(`/admin/meals/balances`, values);
// 어드민 식대 정산 완료 처리 API
export const settlementCancel = (values: any) => postApi.patch(`/admin/meals/balances/cancel`, values);

export const updateMealBudgetByPerson = (values: any) =>
  postApi.patch(`/admin/meals/budget/${values.params}`, values.body, {
    params: { mealStatsIdx: values.params },
  });

// 어드민 복포 설정 일괄 등록 및 수정 API
export const updateWelfarePointBudget = (values: any) => postApi.post(`/admin/welfares/budget`, values);

// 어드민 복포 설정 금액 개별 수정
export const updateWelfarePointByPerson = (values: any) =>
  postApi.patch(`/admin/welfares/budget/${values.params}`, values.body, {
    params: { welfareStatsIdx: values.params },
  });

// 어드민 복포 설정 비고 수정 API
export const updateNoteByPerson = (values: any) => postApi.patch(`/admin/welfares/budget/${values.queryParams}/note`, values.body, { params: { welfareStatsIdx: values.queryParams } });

// 어드민 문의 답변 등록 API
export const submitQna = (values: any) => postApi.patch(`/admin/qna/${values.queryParams}`, values.body);

// 어드민 복포 정산완료 처리 API
export const settleDone = (values: any) => postApi.patch(`/admin/welfares/balances`, values);

// 어드민 활동비 정산완료 처리 API
export const settleActivityConfirm = (values: any) => postApi.patch(`/admin/activities/balances`, values);

// 어드민 활동비 사용가능 금액 개별 수정 API
export const modifyActivityBaseAmount = (values: any) =>
  postApi.patch(`/admin/activities/budget/${values.params}`, values.body, {
    params: { activityStatsIdx: values.params },
  });

// 어드민 활동비 비고 수정 API
export const activityNote = (values: any) => postApi.patch(`/admin/activities/budget/${values.activityStatsIdx}/note`, values.body);

// 어드민 복포 정산완료 처리 API
export const settleActivityConfirmCancel = (values: any) => postApi.patch(`/admin/activities/balances/cancel`, values);

// 어드민 복포 정산완료 취소 처리 API
export const settleCancel = (values: any) => postApi.patch(`/admin/welfares/balances/cancel`, values);

// 어드민 복포 내역 확인 API
export const confirmWelfare = (values: any) => postApi.patch(`/admin/welfares/confirm`, values);

// 어드민 활동비 내역 확인 API
export const confirmActivites = (values: any) => postApi.patch(`/admin/activities/confirm`, values);

// 직원 활성화/비활성화 선택 API
export const editStaffStatus = (values: any) => postApi.patch(`/admin/users/${values.userIdx}`, values);

// 어드민 점심조 설정 API
export const setLunchGroup = (values: any) => postApi.post(`/admin/playground/lunch-group`, values);

// 어드민 점심조 초기화 API
export const resetLunchGroupConfig = () => postApi.delete(`/admin/playground/lunch-group`);

// 어드민 활동비 초기 설정 API
export const updateActivitiesPointBudget = (values: any) => postApi.post(`/admin/activities/budget`, values);

// 공지사항 등록
export const submitNotices = (values: any) =>
  postApi.post(`/admin/notices`, values, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 어드민 공지사항 첨부파일(하나) 업로드 API
export const uploadNoticeImage = (values: any) => postApi.post(`/upload/admin/notices`, values);

// 어드민 공지사항 삭제 API
export const deleteNotice = (values: any) =>
  postApi.delete(`/admin/notices/${values.noticeIdx}`, {
    data: { noticeIdx: values.noticeIdx },
  });

// 어드민 공지사항 삭제 API
export const modifyNotice = (values: any) =>
  postApi.put(`/admin/notices/${values.queryParams}`, values.body, {
    params: { noticeIdx: values.queryParams },
    headers: { "Content-Type": "multipart/form-data" },
  });

// 어드민 출퇴근 내역 삭제 API

export const deleteAttendance = (values: any) =>
  postApi.delete(`/admin/intranet/commute`, {
    data: { commuteIdxList: values.commuteIdx },
  });

// 어드민 출퇴근 특이사항 수정 API
export const modifyNote = (values: any) => postApi.patch(`/admin/intranet/commute/${values.commuteIdx}/note`, values.body);

// 어드민 복포 내역 비고 수정 API
export const modifyNoteWelfare = (values: any) => postApi.patch(`/admin/welfares/${values.welfareIdx}/note`, values.body);

export const modifyNoteWelfareStats = (values: any) => postApi.patch(`/admin/welfares/budget/${values.welfareStatsIdx}/note`, values.body);

// 어드민 출퇴근 내역 삭제 API

export const deleteCommute = (params: any) =>
  postApi.delete(`/admin/intranet/commute`, {
    data: { commuteIdxList: params.commuteIdxList },
  });

// 어드민 출퇴근 시간 수정 API

export const editCommuteTime = (values: any) =>
  postApi.put(`/admin/intranet/commute/${values.commuteIdx}/time`, values.body, {
    params: { commuteIdx: values.queryParams },
  });

// 어드민 개인 휴가 내역 삭제 API

export const deleteVacationDetail = (values: any) => postApi.delete(`/admin/intranet/leave/commute/${values.commuteIdx}`);

// 어드민 휴가 특이사항 수정 API
export const modifyVacationNote = (values: any) => postApi.patch(`/admin/intranet/leave/${values.commuteIdx}/note`, values.body);

// 어드민 직원 특이사항 수정 API
export const modifyStaffNote = (values: any) => postApi.patch(`/admin/users/${values.userIdx}/comment`, values.body);

// 직원 삭제(완전삭제) API
export const deleteStaff = (values: any) => postApi.delete(`/admin/users/${values.userIdx}`);

// 어드민 휴가 추가 부여 API
export const addVacations = (values: any) => postApi.post(`/admin/intranet/leave/extra`, values);

// 어드민 휴가 추가부여 내역 삭제 API
export const deletedVacationGrant = (values: any) => postApi.delete(`/admin/intranet/leave/extra/${values.leaveExtraIdx}`, values);

// 어드민 휴가 추가부여 내역 수정 API
export const modifyVacationGrant = (values: any) =>
  postApi.put(`/admin/intranet/leave/extra/${values.queryParams}`, values.body, {
    params: { leaveExtraIdx: values.queryParams },
  });

// 어드민 연차 관리 총 연차일 수정 API
export const modifyTotalLeave = (values: any) => postApi.patch(`/admin/intranet/leave/${values.leaveStatsIdx}`, values.body);

// 어드민 먼슬리 음료 설정 API
export const monthlyDrink = (values: any) => postApi.post(`/admin/playground/monthly-baverage`, values);

// 어드민 먼슬리 음료 설정 API
export const updateDrink = (values: any) => postApi.post(`/admin/playground/monthly-baverage`, values);
// 어드민 먼슬리 음료 수정 API
export const updateDrinkDetail = (values: any) => postApi.put(`/admin/playground/monthly-baverage`, values.body);

// 어드민 식대 내역 비고 수정 API
export const mealNote = (values: any) => postApi.patch(`/admin/meals/${values.mealIdx}/note`, values.body);

// 어드민 점심조 미배정인원 배정 API
export const manualAssignLunchGroup = (values: any) => postApi.post(`/admin/playground/lunch-group/unassigned`, values);

// 어드민 점심조 배정자 개별 삭제 API
export const resetLunchGroup = (values: any) => postApi.delete(`/admin/playground/lunch-group/users/${values.userIdx}`, { data: { userIdx: values.userIdx } });
