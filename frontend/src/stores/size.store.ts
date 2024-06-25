import { create } from '@/stores/main.store';
import { ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeSize {
  id: string;
  name: string;
  createdAt?: string;
}

interface TypeSizeStore {
  loading: boolean;
  data: TypeSize[];
  detail: TypeSize;
  totalCount: number;
  getSize: (query: ParamsSearch) => void;
  create: (value: string, cb?: () => void) => void;
  update: (values: TypeSize, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const sizeStore = create<TypeSizeStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeSize,
  getSize: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeSize> = await baseRequest.get(
        `/sizes?${generateQueryString(query)}`
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
      const result = await baseRequest.post('/sizes', { name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm kích thước thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeSize, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/sizes/${values.id}`, { name: values.name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật kích thước thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/sizes/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa kích thước thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
