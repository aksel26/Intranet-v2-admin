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

// export const getMeals = () => jsonPlaceholderApi.get('/posts');

export const getMeals = ({ sDate, eDate }: any) => getApi.get(`/admin/meals`, { params: { sDate, eDate } });
