import { create } from '@/stores/main.store';
import { BaseTypeResponse, ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeCreateProduct {
  readonly id?: string;
  readonly name: string;
  readonly images: string | null;
  readonly description: string;
  readonly videoLink: string;
  readonly productTypeId: string;
  readonly sizeId: string;
  readonly surfaceId: string;
  readonly brandId: string;
  readonly productGroupId: string;
  readonly unitId: string;
  readonly isBestSeller: boolean;
  readonly isNew: boolean;
  readonly inStock: boolean;
  readonly showHomepage: boolean;
  readonly retailPrice: number;
  readonly wholesalePrice: number;
  readonly warrantyPeriod: number;
  readonly unitConversions: TypeValueUnitConversion[];
}
export interface TypeValuesProduct extends BaseTypeResponse {
  productTypeId: string | null;
  sizeId: string | null;
  surfaceId: string | null;
  brandId: string | null;
  unitId: string | null;
  productGroupId: string | null;
}

export interface TypeResponseProduct extends Partial<TypeValuesProduct> {
  slug: string;
  description: string;
  size: BaseTypeResponse;
  brand: BaseTypeResponse;
  surface: BaseTypeResponse;
  productGroup: BaseTypeResponse;
  unit: BaseTypeResponse;
  isBestSeller: boolean;
  isNew: boolean;
  inStock: boolean;
  showHomepage: boolean;
  unitConversions: TypeValueUnitConversion[];
  images: string;
}

export interface TypeValueUnitConversion {
  idx?: string | null;
  id?: string | null;
  unitId: string | null;
  conversionRate: number | null;
  retailPrice: number | null;
  wholesalePrice: number | null;
  unit?: BaseTypeResponse;
}

export type ParamsSearchProduct = ParamsSearch & TypeValuesProduct;

interface TypeProductStore {
  loading: boolean;
  data: TypeResponseProduct[];
  detail: TypeResponseProduct;
  totalCount: number;
  getProduct: (query: ParamsSearchProduct) => void;
  create: (values: TypeValuesProduct, cb?: () => void) => void;
  update: (values: TypeValuesProduct, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
  getDetailProduct: (id: string, cb?: (detail: TypeResponseProduct) => void) => void;
  resetDetail: () => void;
}

export const productStore = create<TypeProductStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  detail: {} as TypeResponseProduct,
  getProduct: async (query) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeResponseProduct> = await baseRequest.get(
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
  getDetailProduct: async (id: string, cb) => {
    try {
      set({ loading: true });
      const productDetail: TypeResponseProduct = await baseRequest.get(`/products/${id}`);
      if (productDetail) {
        set({ detail: productDetail });
      }
      if (cb) {
        cb(productDetail);
      }
      set({ loading: false });
    } catch (error) {
      notificationError('Lỗi lấy thông tin sản phẩm');
    }
  },
  resetDetail: () => {
    set({ detail: {} as TypeResponseProduct });
  },
  create: async (values, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.post('/products', { ...values });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Tạo sản phẩm thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values: TypeValuesProduct, cb) => {
    try {
      const { id, ...rest } = values;
      set({ loading: true });
      const result = await baseRequest.put(`/products/${id}`, { ...rest });
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
