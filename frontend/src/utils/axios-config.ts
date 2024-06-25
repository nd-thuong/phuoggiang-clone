import axios, { AxiosError, AxiosResponse } from 'axios';
import { variables } from './variables';
import { getToken, notificationWarning, removeItem } from './helper';

const baseRequest = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
  },
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

baseRequest.interceptors.request.use(
  async (config: any) => {
    return config;
  },
  (error: AxiosError) => {
    Promise.reject(error);
  }
);

baseRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    return response?.data;
  },
  async (error: AxiosError) => {
    if (error?.response?.status === variables.STATUS_401) {
      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            'refresh-token': getToken(),
          },
          {
            withCredentials: true,
          }
        );
        if (result) {
          window.location.reload();
        }
      } catch (error: any) {
        if (error?.response?.data?.message === 'Unauthorized') {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/revoked/refresh-token`,
            {
              'refresh-token': getToken(),
            },
            {
              withCredentials: true,
            }
          );
        }
        notificationWarning('Vui lòng đăng nhập lại');
        removeItem();
        // window.open('/dang-nhap');
        return Promise.reject(error);
      }
    }
    if (!error?.response) {
      return;
    }
    // if (get(error, 'response.status') === 401 || get(error, 'response.status') === 403) {
    //   removeItem();
    //   history.replace(AUTH.login);
    //   return Promise.reject(error);
    // }

    return Promise.reject(error);
  }
);

export default baseRequest;
