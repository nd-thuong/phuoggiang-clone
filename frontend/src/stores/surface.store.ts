import { create } from '@/stores/main.store';
import { ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeSurface {
  id: string;
  name: string;
  createdAt?: string;
}

interface TypeSurfaceStore {
  loading: boolean;
  data: TypeSurface[];
  detail: TypeSurface;
  totalCount: number;
  getSurface: (query: ParamsSearch) => void;
  create: (value: string, cb?: () => void) => void;
  update: (values: TypeSurface, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const surfaceStore = create<TypeSurfaceStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeSurface,
  getSurface: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeSurface> = await baseRequest.get(
        `/surfaces?${generateQueryString(query)}`
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
      const result = await baseRequest.post('/surfaces', { name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm bề mặt thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeSurface, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/surfaces/${values.id}`, { name: values.name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật bề mặt thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/surfaces/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa bề mặt thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
