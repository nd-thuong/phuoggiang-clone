import { create } from '@/stores/main.store';
import { BaseTypeResponse, ParamsSearch, ResultData } from '@/types/response-request';
import baseRequest from '@/utils/axios-config';
import { generateQueryString, notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeResponseInventory {
  id: string;
  product: BaseTypeResponse;
  unit: BaseTypeResponse;
  quantity: number;
  note: string;
}

export interface TypeResponseInventoryEntry {
  id: string;
  product: BaseTypeResponse;
  unitInventory: BaseTypeResponse;
  unitConversion: BaseTypeResponse;
  quantity: number;
  conversion: number;
}

export interface TypeResponseInventoryEntry {
  id: string;
  product: BaseTypeResponse;
  unitConversion: BaseTypeResponse;
  unitInventory: BaseTypeResponse;
  quantity: number;
  conversionQuantity: number;
}

export interface TypeCreateInventory {
  id?: string;
  productId: string;
  unitId: string;
  quantity: number;
  quantityEdit?: number;
  note?: string | null;
}

export type PramsSearchInventory = ParamsSearch;

interface TypeInventoryStore {
  loading: boolean;
  data: TypeResponseInventory[];
  detail: TypeResponseInventory;
  totalCount: number;
  dataInventoryEntry: TypeResponseInventoryEntry[];
  totalCountInventoryEntry: number;
  getInventory: (query: ParamsSearch, cb?: (data: TypeResponseInventory[]) => void) => void;
  create: (value: TypeCreateInventory, cb?: () => void) => void;
  update: (values: TypeCreateInventory, cb?: () => void) => void;
  remove: (value: string, cb?: () => void) => void;
  getDetail: (id: string, cb?: (data: TypeResponseInventory) => void) => void;
  resetDetail: () => void;
  getInventoryEntry: (
    query: ParamsSearch,
    cb?: (data: TypeResponseInventoryEntry[]) => void
  ) => void;
  // getInventoryProduct: (value: ParamsSearch, cb?: (data: TypeResponseInventory) => void) => void;
}

export const inventoryStore = create<TypeInventoryStore>((set) => ({
  loading: false,
  data: [],
  totalCount: 0,
  dataInventoryEntry: [],
  totalCountInventoryEntry: 0,
  detail: {} as TypeResponseInventory,
  getInventory: async (query, cb) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeResponseInventory> = await baseRequest.get(
        `/inventories?${generateQueryString(query)}`
      );
      if (cb) {
        cb(result.items as TypeResponseInventory[]);
      }
      set({
        data: result.items,
        totalCount: result.totalCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
    }
  },
  getInventoryEntry: async (query, cb) => {
    try {
      set({ loading: true });
      const result: ResultData<TypeResponseInventoryEntry> = await baseRequest.get(
        `/inventories/entries?${generateQueryString(query)}`
      );
      if (cb) {
        cb(result.items as TypeResponseInventoryEntry[]);
      }
      set({
        dataInventoryEntry: result.items,
        totalCountInventoryEntry: result.totalCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
    }
  },
  getDetail: async (id, cb) => {
    try {
      set({ loading: true });
      const response: TypeResponseInventory = await baseRequest(`/inventories/${id}`);
      set({ detail: response, loading: false });
      if (cb) {
        cb(response);
      }
    } catch (error) {
      set({ loading: false });
      notificationError('Có lỗi xảy ra khi lấy thông tin chi tiết kho');
    }
  },
  resetDetail: () => {
    set({ detail: {} as TypeResponseInventory });
  },
  create: async (values, cb) => {
    try {
      set({ loading: true });
      const result = await baseRequest.post('/inventories', { ...values });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Thêm mới thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  update: async (values, cb) => {
    try {
      set({ loading: true });
      const { id, ...rest } = values;
      const result = await baseRequest.put(`/inventories/${values.id}`, { ...rest });
      if (result && cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Cập nhật kho thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
  remove: async (id: string, cb) => {
    try {
      set({ loading: true });
      await baseRequest.delete(`/inventories/${id}`);
      if (cb) {
        cb();
      }
      set({ loading: false });
      notificationSuccess('Xóa kho thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
    }
  },
}));
