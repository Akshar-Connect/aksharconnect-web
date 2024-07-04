import axios from 'axios';

async function refreshToken() {
  const refreshTokens = localStorage.getItem("refresh_token");

  const refreshTokenInstance = axios.create({
    baseURL: 'https://ac-be-app-prod-spyo2pxfka-el.a.run.app/user-auth/refresh',
  });

  refreshTokenInstance.defaults.headers.common["Authorization"] = `Bearer ${refreshTokens}`;
  const response = await refreshTokenInstance.post(
    ""
  );

  const data = response.data.access_token
  localStorage.setItem("access_token", data);
  return data; 
}

const axiosInstance = axios.create({
  baseURL: 'https://ac-be-app-prod-spyo2pxfka-el.a.run.app',
});

const handleRequest = (config) => {
  const authToken = localStorage.getItem("access_token");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
};

const handleResponse = (response) => {
  return response;
};

const handleError = async (error) => {
  if (error.response && error.response.status === 401) {
    try {
      const newToken = await refreshToken();
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      const originalRequest = error.config;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return axios(originalRequest);
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(handleRequest);
axiosInstance.interceptors.response.use(handleResponse, handleError);

export default axiosInstance;