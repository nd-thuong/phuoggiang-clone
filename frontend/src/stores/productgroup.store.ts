import { create } from '@/stores/main.store';
import { ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';
import { omit } from 'lodash';
import { TypeBrand } from './brand.store';

export interface TypeProductGroup {
  id: string;
  name: string;
  createdAt?: string;
  brandIds?: string[];
}

export interface ResponseProductGroup {
  id: string;
  name: string;
  brands?: TypeBrand[];
  createdAt?: string;
}

interface TypeProductGroupStore {
  loading: boolean;
  data: TypeProductGroup[];
  detail: TypeProductGroup;
  totalCount: number;
  getProductGroup: (query: ParamsSearch) => void;
  create: (values: TypeProductGroup, cb?: () => void) => void;
  update: (values: TypeProductGroup, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const productGroupStore = create<TypeProductGroupStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeProductGroup,
  getProductGroup: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeProductGroup> = await baseRequest.get(
        `/product-groups?${generateQueryString(query)}`
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
  create: async (values, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.post('/product-groups', values);
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm nhóm sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeProductGroup, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/product-groups/${values.id}`, omit(values, 'id'));
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật nhóm sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/product-groups/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa nhóm sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
