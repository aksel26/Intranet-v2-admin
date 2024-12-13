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

// 어드민 식대 설정 비고 수정 API
export const updateMealBudgetNote = (values: any) =>
  postApi.patch(`/admin/meals/budget/${values.queryParams}`, values.body, {
    params: { mealStatsIdx: values.queryParams },
  });

// 어드민 식대 설정 등록 및 수정 API
export const updateMealBudget = (values: any) => postApi.post(`/admin/meals/budget`, values.body);

// 직원 등록 API
export const addStaff = (values: any) => postApi.post(`/admin/users`, values);

// 직원 수정 API

export const editStaff = (values: any) => postApi.put(`/admin/users/${values.params}`, values.body, { params: { userIdx: values.params } });

// 어드민 식대 정산완료 업데이트 API
export const settlement = (values: any) => postApi.patch(`/admin/meals/balances`, values);
// 어드민 식대 정산 완료 처리 API
export const settlementCancel = (values: any) => postApi.patch(`/admin/meals/balances/cancel`, values);

// 어드민 복포 설정 일괄 등록 및 수정 API
export const updateWelfarePointBudget = (values: any) => postApi.post(`/admin/welfares/budget`, values);

// 어드민 복포 설정 금액 개별 수정
export const updateWelfarePointByPerson = (values: any) =>
  postApi.patch(`/admin/welfares/budget/${values.params}`, values.body, { params: { welfareStatsIdx: values.params } });

// 어드민 복포 설정 비고 수정 API
export const updateNoteByPerson = (values: any) =>
  postApi.patch(`/admin/welfares/budget/${values.queryParams}/note`, values.body, { params: { welfareStatsIdx: values.queryParams } });

// 어드민 문의 답변 등록 API
export const submitQna = (values: any) => postApi.patch(`/admin/qna/${values.queryParams}`, values.body);

// 어드민 복포 정산완료 처리 API
export const settleDone = (values: any) => postApi.patch(`/admin/welfares/balances`, values);

// 어드민 복포 정산완료 취소 처리 API
export const settleCancel = (values: any) => postApi.patch(`/admin/welfares/balances/cancel`, values);

// 어드민 복포 내역 확인 API
export const confirmWelfare = (values: any) => postApi.patch(`/admin/welfares/confirm`, values);

// 직원 삭제(비활성화) API
export const deleteStaff = (params: any) =>
  postApi.delete(`/admin/users/${params.userIdx}`, {
    data: { userIdx: params.userIdx },
  });

// 어드민 점심조 설정 API
export const setLunchGroup = (values: any) => postApi.post(`/admin/playground/lunch-group`, values);

// 어드민 점심조 초기화 API
export const resetLunchGroupConfig = () => postApi.delete(`/admin/playground/lunch-group`);
