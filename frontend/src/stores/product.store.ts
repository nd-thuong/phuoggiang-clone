import { create } from '@/stores/main.store';
import { BaseTypeResponse, ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeValuesProduct extends BaseTypeResponse {
  productTypeId: string | null;
  sizeId: string | null;
  surfaceId: string | null;
  brandId: string | null;
  unitId: string | null;
  productGroupId: string | null;
}

export interface ResponseProduct extends Partial<TypeValuesProduct> {
  slug: string;
  size: BaseTypeResponse;
  brand: BaseTypeResponse;
  surface: BaseTypeResponse;
  productGroup: BaseTypeResponse;
  unit: BaseTypeResponse;
}

export type PramsSearchProduct = ParamsSearch & TypeValuesProduct;

interface TypeProductStore {
  loading: boolean;
  data: ResponseProduct[];
  detail: ResponseProduct;
  totalCount: number;
  getProduct: (query: PramsSearchProduct) => void;
  create: (value: string, cb?: () => void) => void;
  update: (values: TypeValuesProduct, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
}

export const productStore = create<TypeProductStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as ResponseProduct,
  getProduct: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<ResponseProduct> = await baseRequest.get(
        `/products?${generateQueryString(query)}`
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
      const result = await baseRequest.post('/products', { name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeValuesProduct, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.put(`/products/${values.id}`, { name: values.name });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/products/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
