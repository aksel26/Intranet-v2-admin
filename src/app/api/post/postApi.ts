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
