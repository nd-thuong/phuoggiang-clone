import { create } from '@/stores/main.store';
import { ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeBrand {
  id: string;
  name: string;
  createdAt?: string;
}

interface TypeBrandStore {
  loading: boolean;
  data: TypeBrand[];
  detail: TypeBrand;
  totalCount: number;
  getBrand: (query: ParamsSearch) => void;
  create: (value: string, cb?: () => void) => void;
  update: (values: TypeBrand, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const brandStore = create<TypeBrandStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeBrand,
  getBrand: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeBrand> = await baseRequest.get(
        `/brands?${generateQueryString(query)}`
      );
      set({
        data: result.items,
        totalCount: result.totalCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
    }
  },
  create: async (name, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.post('/brands', { name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm thương hiệu thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeBrand, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/brands/${values.id}`, { name: values.name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật thương hiệu thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/brands/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa thương hiệu thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
