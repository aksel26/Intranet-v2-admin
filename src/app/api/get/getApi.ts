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

// 어드민 모든 직원 정보 조회 API
export const getStaffs = (params: any) => getApi.get(`/admin/users`, { params: params });

// 어드민 식대 정산 조회 API
export const getMealsSettlement = (params: any) => getApi.get(`/admin/meals/balances`, { params: params });

// 모든 직급의 IDX 정보 조회 API
export const getGradeIds = () => getApi.get(`/users/gradeIds`);

// 모든 어드민 등급의 IDX 정보 조회 API
export const getAdminGradeIds = () => getApi.get(`/admin/gradeIds`);

// 직원 등록 아이디 중복확인 API
export const checkDuplicateID = (params: any) => getApi.get(`/admin/users/check-login-id/${params.loginId}`, { params: params });

// 직원 등록 아이디 중복확인 API
export const getQna = (params: any) => getApi.get(`/admin/qna`, { params: params });

// 모든 본부의 IDX 정보 조회 API
export const getHqIds = () => getApi.get(`/users/hqIds`);
// 모든 팀의 IDX 정보 조회 API
export const getTeamIds = () => getApi.get(`/users/teamIds`);
