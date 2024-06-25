import { TypeLogin, TypeRegister, TypeResMe, ValueInfoUser, ValueTypeLogout } from '@/types/user';
import { create } from './main.store';
import baseRequest from '@/utils/axios-config';
import { getToken, notificationError, notificationSuccess, removeItem } from '@/utils/helper';
import { AxiosError } from 'axios';

interface ILogin {
  user: TypeResMe | null;
  loading: boolean;
  setUserInfo: (newUserInfo: TypeResMe) => void;
  logout: (value: ValueTypeLogout, cb?: () => void) => void;
  getMe: () => void;
  login: (values: TypeLogin, cb: () => void) => void;
  register: (values: TypeRegister, cb: () => void) => void;
  updateInfoUser: (values: ValueInfoUser, cb: () => void) => void;
}

const fetchDataUser = async () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  const data: TypeResMe = await baseRequest.get('/auth/me');
  return data;
};

export const useUserStore = create<ILogin>((set) => {
  const fetchAndSetData = async () => {
    try {
      const data = await fetchDataUser();
      set({ user: data });
    } catch (error) {
      set({ user: null });
    }
  };

  fetchAndSetData();
  return {
    user: null,
    loading: false,
    setUserInfo: (userInfo: TypeResMe) => {
      set({ user: userInfo });
    },
    login: async (values: TypeLogin, cb) => {
      try {
        set({ loading: true });
        const resultLogin: { refreshToken: string } = await baseRequest.post('/auth/login', values);
        if (resultLogin) {
          localStorage.setItem('rf', resultLogin?.refreshToken);
          const me: TypeResMe = await baseRequest.get('/auth/me');
          if (me) {
            set({ user: me });
            cb();
          }
        }
        set({ loading: false });
      } catch (error) {
        const err = error as AxiosError;
        set({ loading: false });
        if (err?.response?.data) {
          notificationError(err);
        }
      }
    },
    getMe: async () => {
      try {
        const me: TypeResMe = await baseRequest.get('/auth/me');
        if (me) {
          set({ user: me });
        } else {
          removeItem();
          set({ user: null });
        }
      } catch (error) {
        removeItem();
        set({ user: null });
      }
    },
    logout: async (value, cb) => {
      try {
        if (cb) {
          set({ user: null });
          await baseRequest.post('/auth/logout', value);
          cb();
        } else {
          set({ user: null });
          await baseRequest.post('/auth/logout', value);
        }
      } catch (error) {}
    },
    register: async (values, cb) => {
      try {
        set({ loading: true });
        const result: { refreshToken: string } = await baseRequest.post('/auth/register', values);
        if (result) {
          notificationSuccess('Đăng ký tài khoản thành công');
          localStorage.setItem('rf', result?.refreshToken);
          const me: TypeResMe = await baseRequest.get('/auth/me');
          if (me) {
            set({ user: me });
            cb();
          }
        }
        set({ loading: false });
      } catch (error) {
        const err = error as AxiosError;
        if (err.response?.data) {
          notificationError(err);
        }
        set({ loading: false });
      }
    },
    updateInfoUser: async (values, cb) => {
      try {
        set({ loading: true });
        const result = await baseRequest.put('/auth/update-info-user', values);
        if (result && cb) {
          cb();
          notificationSuccess();
        }
        set({ loading: false });
      } catch (error) {
        set({ loading: false });
        const err = error as AxiosError;
        if (err.response?.data) {
          notificationError(err);
        }
      }
    },
  };
});
