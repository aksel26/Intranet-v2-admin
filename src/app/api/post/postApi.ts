import axios from "axios";

const postApi = axios.create({
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

// export const getMeals = () => jsonPlaceholderApi.get('/posts');

// export const logout = () => postApi.post(`/logout`);
// export const submitForm = (values: any) => postApi.post(`/users/qna`, values);

// export const submitMeal = (values: any) => postApi.post(`/users/meals`, values);
// export const submitWelfare = (values: any) => postApi.post(`/users/welfares`, values);
// export const submitActivity = (values: any) => postApi.post(`/users/activities`, values);
// export const submitUpdateWelfare = (values: any) => postApi.put(`/users/welfares/${values.queryParams}`, values.body);
// export const submitUpdateActivity = (values: any) => postApi.put(`/users/activities/${values.queryParams}`, values.body);

// export const deleteMeal = (values: any) => postApi.delete(`/users/meals/${values}`);
// export const deleteWelfare = (values: any) => postApi.delete(`/users/welfares/${values}`);
// export const deleteActivity = (values: any) => postApi.delete(`/users/activities/${values}`);
// export const deleteQna = (values: any) => postApi.delete(`/users/qna`, { data: values });
// export const getWelfares = ({ year, month }: TWelfaresParams) => getApi.get(`/users/welfares`, { params: { year, month } });
// export const getActivities = ({ year, month }: TWelfaresParams) => getApi.get(`/users/activities`, { params: { year, month } });
// export const getMe = () => getApi.get(`/users/me`);
// export const getUsers = () => getApi.get(`/users/ids`);

// 어드민 식대 설정 비고 수정 API
export const updateMealBudgetNote = (values: any) =>
  postApi.patch(`/admin/meals/budget/${values.queryParams}`, values.body, {
    params: { mealStatsIdx: values.queryParams },
  });

// 어드민 식대 설정 등록 및 수정 API
export const updateMealBudget = (values: any) => postApi.post(`/admin/meals/budget`, values.body);

// 직원 등록 API
export const addStaff = (values: any) => postApi.post(`/admin/users`, values);

// 어드민 식대 정산완료 업데이트 API
export const settlement = (values: any) => postApi.patch(`/admin/meals/balances`, values);
// 어드민 식대 정산 완료 처리 API
export const settlementCancel = (values: any) => postApi.patch(`/admin/meals/balances/cancel`, values);





