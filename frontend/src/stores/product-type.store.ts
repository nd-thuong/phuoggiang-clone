import { create } from '@/stores/main.store';
import { ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeProductType {
  id: string;
  name: string;
  createdAt?: string;
}

interface TypeProductTypeStore {
  loading: boolean;
  data: TypeProductType[];
  detail: TypeProductType;
  totalCount: number;
  getProductType: (query: ParamsSearch) => void;
  create: (value: string, cb?: () => void) => void;
  update: (values: TypeProductType, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const productTypeStore = create<TypeProductTypeStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeProductType,
  getProductType: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeProductType> = await baseRequest.get(
        `/product-types?${generateQueryString(query)}`
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
      const result = await baseRequest.post('/product-types', { name });
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
  update: async (values: TypeProductType, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/product-types/${values.id}`, { name: values.name });
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
      await baseRequest.delete(`/product-types/${id}`);
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
