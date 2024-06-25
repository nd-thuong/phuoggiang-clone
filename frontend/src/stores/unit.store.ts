import { create } from '@/stores/main.store';
import { ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeUnit {
  id: string;
  name: string;
  createdAt?: string;
}

interface TypeUnitStore {
  loading: boolean;
  data: TypeUnit[];
  detail: TypeUnit;
  totalCount: number;
  getUnit: (query: ParamsSearch) => void;
  create: (value: string, cb?: () => void) => void;
  update: (values: TypeUnit, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const unitStore = create<TypeUnitStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeUnit,
  getUnit: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeUnit> = await baseRequest.get(
        `/units?${generateQueryString(query)}`
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
      const result = await baseRequest.post('/units', { name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm đơn vị thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeUnit, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/units/${values.id}`, { name: values.name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật đơn vị thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/units/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa đơn vị thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
