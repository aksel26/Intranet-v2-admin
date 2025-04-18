import axios from "axios";

const getApi = axios.create({
  baseURL: "https://test-acg-playground.insahr.co.kr",
  headers: {
    "Content-Type": "application/json",
  },
});

getApi.interceptors.request.use(
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

// 어드민 식대내역 조회 API
export const getMeals = (params: any) => getApi.get(`/admin/meals`, { params: params });

// 어드민 복포 정산 조회 API
export const getSettlementWelfares = (params: any) => getApi.get(`/admin/welfares/balances`, { params: params });

// 어드민 식대 설정 리스트 조회 API
export const getMealsBudget = (params: any) => getApi.get(`/admin/meals/budget`, { params: params });

// 어드민 복포 내역 조회 API
export const getWelfares = (params: any) => getApi.get(`/admin/welfares`, { params: params });

// 어드민 복포 설정 리스트 조회
export const getWelfaresBudget = (params: any) => getApi.get(`/admin/welfares/budget`, { params: params });

// 사용자 이름 검색 API
export const searchStaff = (params: any) => getApi.get(`/admin/users/search-prefix/username`, { params: params });

// 어드민 모든 직원 정보 조회 API
export const getStaffs = (params: any) => getApi.get(`/admin/users`, { params: params });

// 어드민 식대 정산 조회 API
export const getMealsSettlement = (params: any) => getApi.get(`/admin/meals/balances`, { params: params });

// 어드민 식대 정산 상세조회 API
export const getMealExpenses = (params: any) =>
  getApi.get(`/admin/meals/balances/${params.mealStatsIdx}`, {
    params: params,
  });

// 모든 직급의 IDX 정보 조회 API
export const getGradeIds = () => getApi.get(`/users/gradeIds`);

// 모든 어드민 등급의 IDX 정보 조회 API
export const getAdminGradeIds = () => getApi.get(`/admin/gradeIds`);

// 직원 등록 아이디 중복확인 API
export const checkDuplicateID = (params: any) =>
  getApi.get(`/admin/users/check-login-id/${params.loginId}`, {
    params: params,
  });

// 직원 등록 아이디 중복확인 API
export const getQna = (params: any) => getApi.get(`/admin/qna`, { params: params });

// 모든 본부의 IDX 정보 조회 API
export const getHqIds = () => getApi.get(`/users/hqIds`);
// 모든 팀의 IDX 정보 조회 API
export const getTeamIds = () => getApi.get(`/users/teamIds`);

// 어드민 점심조 조회 API
export const getLunchGroup = () => getApi.get(`/admin/playground/lunch-group`);

// 어드민 활동비 내역 조회 API
export const getActivities = (params: any) => getApi.get(`/admin/activities`, { params: params });
// 어드민 휴가 내역 조회 API
export const getVacations = (params: any) => getApi.get(`/admin/intranet/leave`, { params: params });

// 어드민 활동비 설정 리스트 조회 API
export const getActivitiesBudget = (params: any) => getApi.get(`/admin/activities/budget`, { params: params });

// 어드민 활동비 정산 조회 API
export const getSettlementActivites = (params: any) => getApi.get(`/admin/activities/balances`, { params: params });

// 어드민 공지사항 목록 조회 API
export const getNotices = (params: any) => getApi.get(`/admin/notices`, { params: params });

// 어드민 공지사항 상세 조회 API
export const getNoticesDetail = (params: any) => getApi.get(`/admin/notices/${params.noticeIdx}`, { params: params });

// 어드민 출퇴근 관리 조회 API
export const getAttendanceList = (params: any) => getApi.get(`/admin/intranet/commute`, { params: params });

// 모든 사용자의 IDX 정보 조회 API
export const getUsers = () => getApi.get(`/admin/users/ids`);

// 어드민 사용자 휴가관리 상세정보 조회 API

export const getVacationDetail = (params: any) => getApi.get(`/admin/intranet/leave/users/${params.userIdx}`, { params: params });

// 어드민 사용자 휴가관리 요약정보 조회 API 개발
export const getVacationStats = (params: any) => getApi.get(`/admin/intranet/leave/users/${params.userIdx}/stats`, { params: params });
