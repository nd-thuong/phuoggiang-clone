import { ParamsSearch } from '@/types/response-request';
import { Modal, notification } from 'antd';
import { AxiosError } from 'axios';
import { get, isArray } from 'lodash';
import React, { ReactNode } from 'react';
import dayjs from 'dayjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { variables } from './variables';

const { confirm } = Modal;

export const getToken = () => {
  const token = localStorage.getItem('rf');
  return token;
};

export const removeItem = () => {
  return localStorage.removeItem('rf');
};

export const notificationError = (err: AxiosError) => {
  const errors: any = get(err, 'response.data.errors');
  if (isArray(errors)) {
    notification.error({
      message: 'Thông báo',
      description: errors?.map((el) => React.createElement('p', null, el)),
    });
  } else {
    notification.error({
      message: 'Thông báo',
      description: get(err, 'response.data.message'),
    });
  }
};

export const notificationSuccess = (description?: string) => {
  notification.success({
    message: 'Thông báo',
    description: description || 'Cập nhật thành công',
  });
};

export const notificationWarning = (description?: string) => {
  notification.warning({
    message: 'Thông báo',
    description: description || '',
  });
};

export const generateQueryString = (params: ParamsSearch): string => {
  const queryParts: string[] = [];

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key as keyof ParamsSearch];
      if (value !== undefined && value !== null) {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return queryParts.join('&');
};

export const getDate = (date: string) => {
  return dayjs(date).format(variables.DATE_FORMAT.DATE_VI);
};

export const confirmAction = ({ cb, title }: { cb: () => void; title?: string }) => {
  confirm({
    title: title || 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
    icon: React.createElement(ExclamationCircleOutlined),
    centered: true,
    okText: 'Có',
    cancelText: 'Không',
    content:
      'Dữ liệu này có thể đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
    onOk() {
      cb();
    },
    onCancel() {},
    okButtonProps: {
      className: 'bg-[#006af1]',
    },
  });
};
