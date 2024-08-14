import { create } from '@/stores/main.store';
import baseRequest from '@/utils/axios-config';
import { notificationError, notificationSuccess } from '@/utils/helper';
import { AxiosError } from 'axios';

export interface TypeFile {
  filename: string;
  id: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: string;
  url: string;
}

interface TypeUploadStore {
  loading: boolean;
  uploadSingleLocal: (file: File, cb: (data: TypeFile | null, err?: any) => void) => void;
  uploadSingleCloudinary: (file: File, cb: (data: TypeFile | null, err?: any) => void) => void;
  uploadMultipleLocal: (file: File[]) => Promise<TypeFile[]>;
  uploadMultipleCloudinary: (file: File[]) => Promise<TypeFile[]>;
  removeFileLocal: (filename: string, id: string) => void;
  removeFileCloudinary: (filename: string, id: string) => void;
}

export const uploadStore = create<TypeUploadStore>((set) => ({
  loading: false,
  uploadSingleLocal: async (file: File, cb) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      formData.append('file', file);
      const kq = await baseRequest.post('/upload-local/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      cb(kq.data || kq);
      set({ loading: false });
      notificationSuccess('Upload thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      cb(null, err);
      notificationError(err);
    }
  },
  uploadSingleCloudinary: async (file: File, cb) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      formData.append('file', file);
      const kq = await baseRequest.post('/cloudinary-upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      cb(kq.data || kq);
      set({ loading: false });
      notificationSuccess('Upload thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      cb(null, err);
      notificationError(err);
    }
  },
  uploadMultipleLocal: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append('files', file.originFileObj);
    });
    const kq = await baseRequest.post('/upload-local/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return kq.data || kq;
  },
  uploadMultipleCloudinary: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append('files', file.originFileObj);
    });
    const kq = await baseRequest.post('/cloudinary-uploads/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return kq.data || kq;
  },
  removeFileLocal: async (filename: string, id: string) => {
    try {
      set({ loading: true });
      await baseRequest.patch('/upload-local', { filename: filename, id: id });
      set({ loading: false });
      notificationSuccess('Xóa file thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
      return false;
    }
  },
  removeFileCloudinary: async (filename: string, id: string) => {
    try {
      set({ loading: true });
      await baseRequest.patch('/cloudinary-upload', { filename: filename, id: id });
      set({ loading: false });
      notificationSuccess('Xóa file thành công');
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError;
      notificationError(err);
      return false;
    }
  },
}));
